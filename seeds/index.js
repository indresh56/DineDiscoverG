const mongoose = require('mongoose');
const restaurant = require('../models/restaurant');
mongoose.connect('mongodb://localhost:27017/dine-discover', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const seedfun = async () => {
    await restaurant.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const temp = new restaurant({
            title: `Restaurant ${i}`,
            image: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
            description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe, dicta vel, dolor ea velit beatae facere dolorum, ullam repellendus aut quasi provident non ${i}`,
            location: 'Hyderabad, Telangana',
            phone: '+912546789'
        });
        await temp.save();
    }

}

seedfun().then(() => {
    mongoose.connection.close();
})
