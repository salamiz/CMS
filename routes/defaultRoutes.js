const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { trusted } = require('mongoose');
const User = require('../models/UserModel').User;

// set up the routes
// Middleware
router.all('/*', (req, res, next) => {
    // Set layout to "default" for all routes in this module
    req.app.locals.layout = 'default';

    next();
})

router.route('/')
    // get to home route
    .get(defaultController.index);

// Defining local strategy to validate user login attempt
passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
        if (!user) return done(null, false, req.flash('error-message', 'User not found with this email'));
        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) return err;
            if (!passwordMatched) return done(null, false, req.flash('error-message', 'Invalid username or password'));
            return done(null, user, req.flash('success-message', 'Login successful'));
        });
    });
}));

// Serialize user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user){
        done(null, user);
    }).catch(function(error){
        done(error)
    });
});





router.route('/login')
    // get to login route
    .get(defaultController.loginGet)
    // post to login route
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        successFlash: true,
        failureRedirect: '/login',
        failureFlash: true,
        session: true
    }), defaultController.loginPost);

router.route('/register')
    // get to register route
    .get(defaultController.registerGet)
    // post to register route
    .post(defaultController.registerPost);

router.route('/post/:id')
    // get to single post route
    .get(defaultController.singlePost)
    .post(defaultController.submitComment);

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {return next(err);}
        req.flash('success-message', 'Logout was successful');
        res.redirect('/login');
    });
});
// export the router
module.exports = router;