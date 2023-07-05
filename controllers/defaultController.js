// import the Post model from model files
const Post = require('../models/postModel').Post;
// Import the Category model
const Category = require('../models/CategoryModel').Category;
// Import user model
const User = require('../models/UserModel').User;
// Import comment model
const Comment = require('../models/CommentModel').Comment;




const bcrypt = require('bcryptjs');

// export an object with functions to control actions on the application
module.exports = {
    index: async (req, res) => {
        // Get all posts from the database
        const posts = await Post.find({});
        // Get all categories from the database
        const categories = await Category.find({});

        res.render('default/index', {posts: posts, categories: categories});
    },
    loginGet: (req, res) => {
        res.render('default/login');
    },
    loginPost: (req, res) => {
        res.send('Congrats');
    },
    registerGet: (req, res) => {
        res.render('default/register');
    },
    registerPost: (req, res) => {
        // Initialize and empty array to hold error messages
        let errors = [];

        if (!req.body.firstName) {
            errors.push({message: 'First Name is mandatory'});
        }
        if (!req.body.lastName) {
            errors.push({message: 'Last Name is mandatory'});
        }
        if (!req.body.email) {
            errors.push({message: 'Email is mandatory'});
        }
        if (!req.body.password) {
            errors.push({message: 'Password is mandatory'});
        }
        if (!req.body.passwordConfirm) {
            errors.push({message: 'You have to confirm your password'});
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({message: 'Passwords do not match'});
        }

        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        }
        else {
            User.findOne({email: req.body.email}).then(user => {
                if (user){
                    req.flash('error-message', 'Email already exists, try to login');
                    res.redirect('/login');
                }
                else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            // if (err) return err;

                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'You are now registered.');
                                res.redirect('/login');
                            });
                        });
                    });
                }

            });
        }
    },

    singlePost: async (req, res) => {
        const id = req.params.id;
        // Get all categories from the database
        const categories = await Category.find({});
        Post.findById(id)
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(post => {
                if (!post) {
                    res.status(404).json({message: 'No Post Found'});
                }
                else {
                    res.render('default/singlePost', {post: post, categories: categories, comments: post.comments});
                }
            })
    },

    submitComment: (req, res) => {
        if(req.user) {
            Post.findById(req.body.id).then( post => {
                const newComment = new Comment ({
                    user: req.user.id,
                    body: req.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        req.flash('success-message', 'Your comment was submitted for review.');
                        res.redirect(`/post/${post._id}`);
                    });
                });
            });
        }

        else{
            req.flash('error-message', 'Login first to comment');
            res.redirect('/login');
        }
    }

}