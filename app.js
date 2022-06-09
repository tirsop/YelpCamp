console.log(`\n\n\n\n\n\n\n\n\n
******************************************************************`);

// if (process.env.NODE_ENV !== "production") {
import 'dotenv/config';
// }

import express from 'express';                                  //import express package
const app = express();                                          // abbreviation of the code
import path from 'path';
import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;
import ExpressError from './utils/ExpressError.js';        // to throw an error with custome statusCode and msg
import methodOverride from 'method-override';             // for using put/patch request in the html forms
import ejsMate from 'ejs-mate';                            // for creating the boilerplate
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js'                           // require user model
import MongoStore from 'connect-mongo'  // video 574
import mongoose from "mongoose";                            // import mongoose and choose db
const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl)
  .then(() => console.log(`--------------console.log\nDatabase connected\n`))
  .catch(err => {
    console.log(`--------------console.log\nMONGO CONNECTION ERROR:`)
    console.log(err + `\n`)
  })
// import files that containing the routes
import userRoutes from './routes/users.js'
import campgroundRoutes from './routes/campgrounds.js';
import reviewRoutes from './routes/reviews.js';
// middleware
app.engine('ejs', ejsMate);                                 // for creating the boilerplate
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');                               // for requiring ejs files.
app.use(express.urlencoded({ extended: true }))           // need this line to use req.body.  use runs a function in every single request. 
app.use(methodOverride('_method'));                      // to send request by forms other than get or post
app.use(express.static(path.join(__dirname, 'public')));    // serve the public's folder assets

const secret = process.env.SECRET || 'thisshouldbeabettersecret'

// commented lines below are video 574
// const store = new MongoStore({
//   url: dbUrl,
//   secret,
//   touchAfter: 24 * 3600 // time period in seconds
// })
// store.on("error", function (e) {
//   console.log("SeSSION STORE ERROR", e);
// })


// express session using local memory
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600 // time period in seconds
  }),
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,    // session expires in 8 hours
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {                             // creation of local variables accesible from all templates
  res.locals.currentUser = req.user;                      // used in the navbar template to decide whether display links or not
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


// Routes
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home')
})

// all: for all types of request. *: for any url which is not above ones
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
})
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, Something went wrong!'
  res.status(statusCode).render('error', { err });
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`--------------console.log\nListening at:\nhttp://localhost:${port}\n`);
})