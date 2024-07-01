const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });

    try {
        reguser = await User.register(user, password);
        req.login(reguser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/restaurant');
        })
    } catch (err) {
        req.flash('error', 'User already registered ');
        res.redirect('/register');
    }


})

router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect('/restaurant');
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/restaurant');
    });
});
module.exports = router;