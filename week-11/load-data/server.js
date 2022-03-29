const express = require("express");
const mongoose = require("mongoose");

// Set up Express.
const app = express();

// Connect to the MongoDB
mongoose.connect("connection_string", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Define our model
const nameSchema = new mongoose.Schema({
    "nickname": {
        "type": String,
        "unique": true
    },
    "fName": String,
    "lName": String,
    "age": {
        "type": Number,
        "default": 25
    },
    "profileUrl": String
});

const nameModel = mongoose.model("names", nameSchema);

// Define routes
app.get("/", (req, res) => {
    res.send("Ready to go ...");
});

app.get("/load-data/names", (req, res) => {

    // Protect this route, so only "data clerks" can access it.

    // if (req.session && req.session.user && req.session.isClerk) {
    //     // Clerk signed in.
    //     // Load the data here.
    // }
    // else {
    //     // Show error, not authorized.
    //     res.send("You are not authorized.");
    // }

    nameModel.find().count({}, (err, count) => {
        if (err) {
            res.send("Couldn't count the documents: " + err);
        }
        else if (count === 0) {
            // No documents exist.  Add them now.
            var namesToAdd = [
                { nickname: "Nick", fName: "Nicholas", lName: "Romanidis", age: 41 },
                { nickname: "Jane", fName: "Jane", lName: "Doe", age: 30 },
                { nickname: "John", fName: "Johnny", lName: "Smith", age: 35 }
            ];

            nameModel.collection.insertMany(namesToAdd, (err, docs) => {
                if (err) {
                    res.send("Coudn't insert the names: " + err);
                }
                else {
                    res.send("Success, data was uploaded!");
                }
            });
        }
        else {
            res.send("There are already documents loaded.");
        }
    });


});

// Start listening.
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);