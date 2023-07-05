// Load the module dependencies
const mongoose = require('mongoose');
// create schema  object using the constructor method of Mongoose
const Schema = mongoose.Schema;
const CategorySchema= new Schema({
    title:{
        type: String,
        required: true
    },
});



// export the model
module.exports = {Category: mongoose.model('category', CategorySchema )};