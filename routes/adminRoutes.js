// Import statements
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require('../config/customFunctions');


// Middleware
router.all('/*', isUserAuthenticated ,(req, res, next) => {
    // Set layout to "admin" for all routes in this module
    req.app.locals.layout = 'admin';

    next();
})


// Routes
router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts);


router.route('/posts/create')
    .get(adminController.createPosts)
    .post(adminController.submitPosts);


router.route('/posts/edit/:id')
    .get(adminController.editPosts)
    .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

// Admin Category Routes
router.route('/category')   
    .get(adminController.getCategories)
router.route('/category/create')
    .post(adminController.createCategories);
router.route('/category/edit/:id')
    .get(adminController.editCategoriesGetRoute)
    .post(adminController.editCategoriesPostRoute);
router.route('/category/delete/:id')
    .delete(adminController.deleteCategory);

// Admin comment routes
router.route('/comment')
    .get(adminController.getComments)




// router.get('/logout', (req, res) => {
//     req.logOut((err) => {
//         if (err) {return next(err);}
//         req.flash('success-message', 'Logout was successful');
//         res.redirect('/login');
//     });
// });
// Export router
module.exports = router;