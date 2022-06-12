import express from 'express';
const router = express.Router();

import Campground from '../models/campground.js';           // import mongoose model created inside models folder
import campgrounds from '../controllers/campgrounds.js';

import catchAsync from '../utils/catchAsync.js';            // try and catch errors in async functions
import { isLoggedIn, isAuthor, validateCampground } from '../middleware.js';              // what to do if user is not authenticate




router.get('/', catchAsync(campgrounds.index));         // Index page, list of all items. 
router.get('/new', isLoggedIn, campgrounds.newCamp);    // Creates new item. 1st display a form (/new), then post to save item (req.body) in the db
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp));
router.get('/:id', catchAsync(campgrounds.showCamp));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCamp));          // Updates/edit item. 1st shows pre-filled form, then updates value & redirect to show page.
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCamp));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCamp));       // Delete an item by taking its id. 'Delete' button is at the show.ejs


export default router;