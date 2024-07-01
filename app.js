if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const Restaurant = require('./models/restaurant');
const Review = require('./models/review');

const restaurantRoutes = require('./routes/restaurant')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')

const dbUrl = process.env.DB_URL;

mongoose.connect('mongodb://localhost:27017/dine-discover', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'secretconfig',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 24 * 60 * 60 * 7 * 1000,
        maxAge: 24 * 60 * 60 * 7 * 1000
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    //Middleware for storing locally so it can be accessed 
    next();
})

app.use('/', userRoutes)
app.use('/restaurant/:id/reviews', reviewRoutes)
app.use('/restaurant', restaurantRoutes);

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(3000, () => {
    console.log('Serving on port 3000');
})