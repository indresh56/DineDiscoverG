const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Restaurant = require('./models/restaurant');
const Review = require('./models/review');
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

app.get('/', (req, res) => {
    res.send('Hello')
})
app.get('/restaurant', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurant/index', { restaurants });
})
app.get('/restaurant/new', (req, res) => {
    res.render('restaurant/new');
})
app.post('/restaurant', async (req, res) => {
    const temp = new Restaurant(req.body.restaurant);
    await temp.save();
    res.redirect(`/restaurant/${temp._id}`);
})
app.get('/restaurant/:id', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    res.render('restaurant/show', { restaurant });
})
app.get('/restaurant/:id/edit', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render('restaurant/edit', { restaurant });
})
app.put('/restaurant/:id', async (req, res) => {
    const { id } = req.params;
    const temp = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    res.redirect(`/restaurant/${temp._id}`);
});
app.delete('/restaurant/:id', async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurant');
})
app.post('/restaurant/:id/reviews', async (req, res) => {
    const temp = await Restaurant.findById(req.params.id);
    const rev = new Review(req.body.review);
    temp.reviews.push(rev);
    await rev.save();
    await temp.save();
    res.redirect(`/restaurant/${temp._id}`);
})
app.delete('/restaurant/:id/reviews/:reviewId', async (req, res) => {
    await Restaurant.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/restaurant/${req.params.id}`)
})
app.listen(3000, () => {
    console.log('Serving on port 3000');
})