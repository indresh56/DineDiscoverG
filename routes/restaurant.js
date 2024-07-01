const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const { isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary/index');
const upload = multer({ storage });

router.get('/', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurant/index', { restaurants });
})
router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurant/new');
})
router.post('/', isLoggedIn, upload.array('image'), async (req, res) => {
    const temp = new Restaurant(req.body.restaurant);
    temp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    temp.author = req.user._id;
    await temp.save();
    req.flash('success', 'New Restaurant added succesfully')
    res.redirect(`/restaurant/${temp._id}`);
})
router.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
        //populating review with author
    });
    if (!restaurant) {
        req.flash('error', 'Restaurant not found');
        return res.redirect('/restaurant');
    }

    res.render('restaurant/show', { restaurant });
})
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('error', 'Restaurant not found');
        return res.redirect('/restaurant');
    }
    restaurant.images.forEach((img, i) => {
        restaurant.images[i].url = img.url.replace('/upload', '/upload/w_200')
    });
    res.render('restaurant/edit', { restaurant });
})
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), async (req, res) => {
    const { id } = req.params;
    const temp = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    temp.images.push(...img);
    await temp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await temp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Restaurant updated succesfully')
    res.redirect(`/restaurant/${temp._id}`);
});
router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;

    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Restaurant deleted succesfully')

    res.redirect('/restaurant');
})
module.exports = router;