// import the Post model
const Post = require('../models/postModel').Post;
// import the Category model
const Category = require('../models/CategoryModel').Category;
// Import comment model
const Comment = require('../models/CommentModel').Comment;
// Import the customFunctions file
const {isEmpty} = require('../config/customFunctions');


// export an object with functions to control actions on the application
module.exports = {
    index: (req, res) => {
        res.render('admin/index');
    },

    getPosts: (req, res) => {
        Post.find()
            .populate('category')
            .then(posts => {
                res.render('admin/posts/index', {posts: posts});
        });
    },

    submitPosts: (req, res) => {
        // Check for any input file
        let filename = '';
        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, (err) => {
                if (err) throw err;
            });
        }
        
        // Check if the allowComments checkbox is checked
        const commentsAllowed = req.body.allowComments ? true : false;
        // Create a new post with the provided data
        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            description: req.body.description,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });
        // Save the post to the database
        newPost.save().then(post => {
            // Handle the case when the post is saved successfully
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        }).catch(error => {
            // Handle the case when there is an error saving the post
            req.flash('error-message', 'Error creating post.');
            res.redirect('/admin/posts');
        });
    },

    createPosts: (req, res) => {
        Category.find().then(categories => {
            res.render('admin/posts/create', {categories: categories});
        });
    },

    editPosts: (req, res) => {
        const id = req.params.id;
        Post.findById(id)
        .then(post => {
            Category.find().then(categories => {
                res.render('admin/posts/edit', {post: post, categories: categories});
            });
        }).catch(error => {
            // Handle the case when there is an error editing the post
            req.flash('error-message', 'Error editing post.');
            res.redirect('/admin/posts/edit');
        });
    },

    editPostSubmit: (req, res) =>{
        // Check for any input file
        let filename = '';
        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, (err) => {
                if (err) throw err;
            }); 
        }

        const commentsAllowed = req.body.allowComments ? true : false;
        const id = req.params.id;
        Post.findById(id)
        .then(post => {
            post.title = req.body.title;
            post.status = req.body.status;
            post.description = req.body.description;
            post.allowComments = commentsAllowed;
            post.category = req.body.category;
            post.file = `/uploads/${filename}`
            post.save().then(updatePost => {
                req.flash('success-message', `The post ${updatePost.title} has been updated.`);
                res.redirect('/admin/posts');
            });
        });
    },

    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id).then(deletedPost => {
            req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
            res.redirect('/admin/posts');
        }).catch(error => {
            // Handle the case when there is an error deleting the post
            req.flash('error-message', 'Error deleting post.');
            res.redirect('/admin/posts');
        });
    },

    // All Category Methods
    getCategories: (req, res) => {
        Category.find().then(categories => {
            res.render('admin/category/index', {categories: categories});
        });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;
        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });
            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }
    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;
        const cats = await Category.find();
        Category.findById(catId).then(cat => {
            res.render('admin/category/edit', {category: cat, categories: cats});
        });
    },

    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;
        if (newTitle) {
            Category.findById(catId).then(category => {
                category.title = newTitle;
                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });
            });
        }
    },

    deleteCategory: (req, res) => {
        Category.findByIdAndDelete(req.params.id).then(deletedCategory => {
            req.flash('success-message', `The category ${deletedCategory.title} has been deleted.`);
            res.redirect('/admin/category');
        }).catch(error => {
            // Handle the case when there is an error deleting the category
            req.flash('error-message', 'Error deleting category.');
            res.redirect('/admin/category');
        });
    },

    // Comment Route Section
    getComments: (req, res) => {
        Comment.find()
            .populate('user')
            .then(comments => {
                res.render('admin/comments/index', {comments: comments});
            });
    }
};