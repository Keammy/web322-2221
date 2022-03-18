const express = require("express");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");

// Set up dotenv to protect environment variables
dotenv.config({ path: "./config/keys.env" });

// Set up express
const app = express();

// Set up a static folder
app.use(express.static("public"));

// Set up body-parser
app.use(express.urlencoded({ extended: false }));

// Set up express-upload
app.use(fileUpload());

// Set up handlebars
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // res.locals.user is a global handlebars variable.
    // This means that every single handlebars file can access this variable.
    res.locals.user = req.session.user;
    next();
});

// Set up and connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONN_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to the MongoDB database.");
})
.catch((err) => {
    console.log(`There was a problem connecting to MongoDB ... ${err}`);
});


// Set up routers / controllers
const generalController = require("./controllers/general");
const userController = require("./controllers/user");

app.use("/", generalController);
app.use("/user/", userController);


// Start up express web server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Web server started on port ${PORT}.`);
})