module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You are not logged in');
        return res.redirect('/login');
    }
    next();
}

const Restaurant = require('./models/restaurant');
const Review = require('./models/review');
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('error', 'Restaurant not found');
        return res.redirect('/restaurant');
    }
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You are not allowed to do that');
        return res.redirect(`/restaurant/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect('/restaurant');
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not allowed to do that');
        return res.redirect(`/restaurant/${id}`);
    }
    next();
}