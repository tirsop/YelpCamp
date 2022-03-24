console.log(`\n\n\n\n\n\n\n\n\n
******************************************************************`);

import express from 'express';                                  //import express package
import path from 'path';
import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;
import catchAsync from './utils/catchAsync.js';            // to try and catch errors in async functions
import ExpressError from './utils/ExpressError.js';        // to throw an error with custome statusCode and msg
import { campgroundSchema, reviewSchema } from './schemas.js';
import methodOverride from 'method-override';             // for using put/patch request in the html forms
import ejsMate from 'ejs-mate';                            // for creating the boilerplate
import mongoose from "mongoose";
import Campground from './models/campground.js';                // import mongoose model created inside models folder
import Review from './models/review.js';                // import mongoose model created inside models folder
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log(`--------------console.log\nDatabase connected\n`)
    })
    .catch(err => {
        console.log(`--------------console.log\nMONGO CONNECTION ERROR:`)
        console.log(err + `\n`)
    })
const app = express();                                          // abbreviation of the code
app.engine('ejs', ejsMate);                                 // for creating the boilerplate
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');                                  // for requiring ejs files.
app.use(express.urlencoded({ extended: true }))           // need this line to use req.body.  use runs a function in every single request. 
app.use(methodOverride('_method'));                      // to send request by forms other than get or post




const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// // test of port connection
// app.get('/', (req, res) => {
//     res.send("home");
// })
// // test of database
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'cheap camping!' });
//     await camp.save();
//     res.send(camp);
// })

// Index page, list of all items. 
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
// Create a new item. First display the form (/new) and then use post to save the item (req.body) in the db
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Show the details of each item finding them by id
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))
// Updates/edit item. 1st shows pre-filled form, then updates value & redirect to show-details page.
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Delete an item by taking its id. 'Delete'button is at the show.ejs
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
// Create a new review for a campground
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))
// Delete a review of a campground
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))




app.all('*', (req, res, next) => {                      // all: for all types of request. *: for any url which is not above ones
    next(new ExpressError('Page not found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!'
    res.status(statusCode).render('error', { err });
})




const port = 3000;
app.listen(port, () => {
    console.log(`--------------console.log\nListening at:\nhttp://localhost:${port}\n`);
})
