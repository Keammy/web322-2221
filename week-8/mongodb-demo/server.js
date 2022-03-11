const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

// Set up Express.
const app = express();

// Set up Handlebars.
app.engine('.hbs', exphbs.engine({
    extname: '.hbs'
}));

app.set("view engine", ".hbs");

// Set up Body Parser.
app.use(express.urlencoded({ extended: true }));

// Connect to the MongoDB
mongoose.connect("database_connection_string_from_Mongodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define our models
const nameSchema = new mongoose.Schema({
    "nickname": {
        "type": String,
        "unique": true
    },
    "fName": String,
    "lName": String,
    "age": {
        "type": Number,
        "default": 20
    }
});

const nameModel = mongoose.model("names", nameSchema);

app.get("/", (req, res) => {
    nameModel.find()
    .exec()
    .then(data => {
        // Pull the data (exclusively)
        // This is to ensure that our "data" object contains the returned data (only) and nothing else.
        data = data.map(value => value.toObject());

        // Render the "viewTable" view with the data
        res.render("viewTable", {
            data: data,
            layout: false
        });
    });
});

// Define a route to add a new name
app.post("/addName", (req, res) => {
    let age = parseInt(req.body.age);

    if (isNaN(age))
        age = undefined;

    const newName = new nameModel( {
        nickname: req.body.nickname,
        lName: req.body.lName,
        fName: req.body.fName,
        age: age
    });

    newName.save(err => {
        if (err) {
            console.log("Couldn't create the name: " + req.body.nickname);
        }
        else {
            console.log("Created a name document for " + req.body.nickname);
        }

        // Redirect to home page.
        res.redirect("/");
    });
});

// Define a route to update or delete a name
app.post("/updateName", (req, res) => {

    // Check to see if both the first name and last name fields are blank (delete)
    if (req.body.lName.trim().length === 0 && req.body.fName.trim().length === 0) {
        // Remove the document from the collection
        nameModel.deleteOne({
            nickname: req.body.nickname
        })
        .exec()
        .then(() => {
            console.log("Successfully deleted the name for " + req.body.nickname);

            // Redirect to home page.
            res.redirect("/");
        });
    }
    else {
        let age = parseInt(req.body.age);

        if (isNaN(age))
            age = undefined;
    
        // Update the document in the collection
        nameModel.updateOne({
            nickname: req.body.nickname
        }, {
            $set: {
                lName: req.body.lName,
                fName: req.body.fName,
                age: age
            }
        })
        .exec()
        .then(() => {
            console.log("Successfully update the name for " + req.body.nickname);

            // Redirect to home page.
            res.redirect("/");
        });

    }
});

// Start listening.
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);