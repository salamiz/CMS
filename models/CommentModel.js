// Load the module dependencies
const mongoose = require('mongoose');
// create schema  object using the constructor method of Mongoose
const Schema = mongoose.Schema;
const CommentSchema= new Schema({
    body: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    commentIsApproved: {
        type: Boolean,
        default: false
    }
});



// export the model
module.exports = {Comment: mongoose.model('comment', CommentSchema )};