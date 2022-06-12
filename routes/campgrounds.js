import express from 'express';
const router = express.Router();

import campgrounds from '../controllers/campgrounds.js';

import { isLoggedIn, isAuthor, validateCampground } from '../middleware.js';              // what to do if user is not authenticate
import catchAsync from '../utils/catchAsync.js';            // try and catch errors in async functions

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp));

router.get('/new', isLoggedIn, campgrounds.newCamp);

router.route('/:id')
  .get(catchAsync(campgrounds.showCamp))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCamp));

export default router;