import express from 'express';
import passport from 'passport';
const router = express.Router();

import users from '../controllers/users.js'

import catchAsync from '../utils/catchAsync.js';

router.get('/register', users.renderRegister);
router.post('/register', catchAsync(users.register));
router.get('/login', users.renderLogin);
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
router.get('/logout', users.logout);

export default router;
