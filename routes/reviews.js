import express from 'express';
const router = express.Router({ mergeParams: true });

import Campground from '../models/campground.js';        // import mongoose model created inside models folder
import Review from '../models/review.js';                // import mongoose model created inside models folder
import { reviewSchema } from '../schemas.js';             // JOI schema used to validate new/updated camps in the server side

import catchAsync from '../utils/catchAsync.js';         // try and catch errors in async functions
import ExpressError from '../utils/ExpressError.js';     // throw an error with custome statusCode and msg


// Function that validates new/updated items in the server side
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// Creates new review of an item
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Delete review of an item
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
}))



export default router;