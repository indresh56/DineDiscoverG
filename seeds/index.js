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
    for (let i = 0; i < 10; i++) {
        const temp = new restaurant({
            title: `Restaurant ${i}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dhzdqftew/image/upload/v1719067639/DineDiscover/dzjkzzj68qpnh6rw5osw.jpg',
                    filename: 'DineDiscover/dzjkzzj68qpnh6rw5osw',
                },
                {
                    url: 'https://res.cloudinary.com/dhzdqftew/image/upload/v1719067639/DineDiscover/b7ouecr0j3bgwckt4cvp.jpg',
                    filename: 'DineDiscover/b7ouecr0j3bgwckt4cvp',
                }
            ],
            description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe, dicta vel, dolor ea velit beatae facere dolorum, ullam repellendus aut quasi provident non ${i}`,
            location: 'Hyderabad, Telangana',
            phone: '+912546789',
            author: '667411339408db664f179030'
        });
        await temp.save();
    }

}

seedfun().then(() => {
    mongoose.connection.close();
})
