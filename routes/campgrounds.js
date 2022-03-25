import express from 'express';
const router = express.Router();

import Campground from '../models/campground.js';           // import mongoose model created inside models folder
import { campgroundSchema } from '../schemas.js';           // JOI schema used to validate new/updated camps in the server side

import catchAsync from '../utils/catchAsync.js';            // try and catch errors in async functions
import ExpressError from '../utils/ExpressError.js';        // throw an error with custome statusCode and msg


// Function that validates new/updated items in the server side
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// Index page, list of all items. 
router.get('', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
// Creates new item. 1st display a form (/new), then post to save item (req.body) in the db
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Show the details of each item finding them by id
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))
// Updates/edit item. 1st shows pre-filled form, then updates value & redirect to show page.
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Delete an item by taking its id. 'Delete' button is at the show.ejs
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))



export default router;