const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    phone: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
RestaurantSchema.post('findOneAndDelete', async function (del) {
    if (del) {
        await review.deleteMany({
            _id: { $in: del.reviews }
        })
    }
})
module.exports = mongoose.model('Restaurant', RestaurantSchema);