import express from 'express';
import passport from 'passport';
const router = express.Router();
import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';

router.get('/register', (req, res) => {
  res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    await req.login(registeredUser)
    req.flash('success', 'Welcome to Yelp Camp!');
    res.redirect('/campgrounds');
    // req.login(registeredUser, err => {   // so when user registers, he also logs in
    //   if (err) return next(err);
    //   req.flash('success', 'Welcome to Yelp Camp!');
    //   res.redirect('/campgrounds');
    // })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
})

export default router;