// Load the module dependencies
const mongoose = require('mongoose');
// create schema  object using the constructor method of Mongoose
const Schema = mongoose.Schema;
const UserSchema= new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});



// export the model
module.exports = {User: mongoose.model('user', UserSchema )};