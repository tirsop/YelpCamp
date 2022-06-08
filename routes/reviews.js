import express from 'express';
const router = express.Router({ mergeParams: true });

import Campground from '../models/campground.js';        // import mongoose model created inside models folder
import Review from '../models/review.js';                // import mongoose model created inside models folder
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';

import catchAsync from '../utils/catchAsync.js';         // try and catch errors in async functions



// review routes have this shape: /campgrounds/id/reviews/reviewId  (check app.js)

// Creates new review of an item
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${campground._id}`);
}))
// Delete review of an item
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted a review!');
  res.redirect(`/campgrounds/${id}`);
}))



export default router;