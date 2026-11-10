const express = require('express')
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/signup', authController.getSignupForm);
router.post('/signup', authController.postSignup);

router.get('/login', authController.getLoginForm);
router.post('/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.get('/logout', authController.logoutUser)

module.exports = router;