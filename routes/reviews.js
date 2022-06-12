import express from 'express';
const router = express.Router({ mergeParams: true });

import reviews from '../controllers/reviews.js'

import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';
import catchAsync from '../utils/catchAsync.js';         // try and catch errors in async functions


// review routes have this shape: /campgrounds/id/reviews/reviewId  (check app.js)
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview));

export default router;