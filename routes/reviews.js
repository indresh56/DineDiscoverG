const express = require('express');
const router = express.Router({ mergeParams: true });
//to access req.params we have to specify mergeParams:true

const { isLoggedIn, isReviewAuthor } = require('../middleware');

const Review = require('../models/review');
const Restaurant = require('../models/restaurant');

router.post('/', isLoggedIn, async (req, res) => {
    const temp = await Restaurant.findById(req.params.id);
    const rev = new Review(req.body.review);
    rev.author = req.user._id;
    temp.reviews.push(rev);
    await rev.save();
    await temp.save();
    req.flash('success', 'Review created succesfully')

    res.redirect(`/restaurant/${temp._id}`);
})
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
    await Restaurant.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Review deleted succesfully')
    res.redirect(`/restaurant/${req.params.id}`)
})
module.exports = router;