console.log(`\n\n\n\n\n\n\n\n\n
******************************************************************`);

import express from 'express';                                  //import express package
import path from 'path';
import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;
import ExpressError from './utils/ExpressError.js';        // to throw an error with custome statusCode and msg
import methodOverride from 'method-override';             // for using put/patch request in the html forms
import ejsMate from 'ejs-mate';                            // for creating the boilerplate

import campgrounds from './routes/campgrounds.js';
import reviews from './routes/reviews.js';

import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log(`--------------console.log\nDatabase connected\n`))
    .catch(err => {
        console.log(`--------------console.log\nMONGO CONNECTION ERROR:`)
        console.log(err + `\n`)
    })

const app = express();                                          // abbreviation of the code

app.engine('ejs', ejsMate);                                 // for creating the boilerplate
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');                               // for requiring ejs files.
app.use(express.urlencoded({ extended: true }))           // need this line to use req.body.  use runs a function in every single request. 
app.use(methodOverride('_method'));                      // to send request by forms other than get or post
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// all: for all types of request. *: for any url which is not above ones
app.all('*', (req, res, next) => {
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