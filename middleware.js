import { campgroundSchema, reviewSchema } from './schemas.js';           // JOI schema used to validate new/updated camps in the server side
import ExpressError from './utils/ExpressError.js';        // to throw an error with custome statusCode and msg
import Campground from './models/campground.js';           // import mongoose model created inside models folder


// Function that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
  }
  next();
}
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
// Function that checks if the current user is the creator of the camp (thus he has permission to edit, delete)
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

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

export { isLoggedIn, validateCampground, isAuthor, validateReview }