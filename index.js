/**
 * Name: Zulkifli Salami
 * file: index.js 
 * Description: This is the main file for the server. It will be used to connect to the database and start the server.
*/

// Importing the required modules
const express = require('express'); // JS framework
const mongoose = require('mongoose'); // Node.js based ODM (object data modeling) libary for MongoDB database
const path = require('path') // node.js module used to find the right paths to access and manage files in project directory
const exphbs = require('express-handlebars'); // special templates or guides that help organize and display information on a web page
const {mongoDbUrl} = require('./config/config'); // import variable from config file in config directory
const {PORT} = require('./config/config'); // set port to 3000 or use the port provided by the environment variable
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport'); // import passport package
const {globalVariables} = require('./config/config'); // import global variables
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // import method-override package
const {selectOption} = require('./config/customFunctions'); // import the customFunctions file
const fileUpload = require('express-fileupload'); // import express-fileupload package



// Creating app
const app = express();

/**
 * Connecting to MongoDB database using connect() function
 * connect() expects a string with protocol mongodb:// server address: port / databasename
 */
mongoose.connect(mongoDbUrl, {useNewUrlParser: true})
// response in case connection is successful
    .then(response => {
        console.log('MongoDB connected Successfully.');
    })
// Error message in case DB connection failed    
    .catch(error => {
        console.log('Database connection failed.');
    });

/**
 * Configure express using .use function
 * Defines a middleware used to assist and controll the functionality of the web application
*/
app.use(express.json()); // change data to a json format
app.use(express.urlencoded({extended: true})); // organize and assist in understanding information received by the application in order to use it correctly
app.use(express.static(path.join(__dirname, 'public'))); // link public folder directory containing static files for web application (i.e css, JS) using express


// Flash and Express session middleware
app.use(session({
    secret:'anysecret',  // for creating sessions
    saveUninitialized: true, // save uninitialized session
    resave: true // resave session
}));

// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());




app.use(flash());   // flash messages initialization

app.use(globalVariables); // Global variables

// File upload middleware
app.use(fileUpload());

// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




/**
 * Setup view engine to use handlebars
*/
app.engine('handlebars', exphbs.engine({defaultLayout: 'default', helpers: {select: selectOption}, runtimeOptions: {allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}})); // set default layout to default.handlebars
app.set('view engine', 'handlebars'); // set view engine to handlebars

// Method override middleware
app.use(methodOverride('newMethod'));


// Routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);



/**
 * App listen Function, enables web application act like a server which listens for requests or messages from other computers,
 * enabling this application to receive information or instructions.
 * Creates the server start at port PORT
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});