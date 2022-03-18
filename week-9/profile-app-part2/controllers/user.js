const bcrypt = require("bcryptjs");
const express = require("express");
const userModel = require("../models/user");
const router = express.Router();
const path = require("path");

// (GET) Route to a registration page
router.get("/register", (req, res) => {
    res.render("user/register");
});

// (POST) Route to a registration page
router.post("/register", (req, res) => {

    // TODO: Validate the form information.

    const user = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    user.save()
        .then((userSaved) => {
            // User was saved correctly.
            console.log(`User ${userSaved.firstName} has been added to the database.`);

            // Create a unique name for the image, so that it can be saved in the file system.
            let uniqueName = `profile-pic-${userSaved._id}${path.parse(req.files.profilePic.name).ext}`;

            // Copy the image data to a file in the "public/profile-pictures" folder.
            req.files.profilePic.mv(`public/profile-pictures/${uniqueName}`)
            .then(() => {
                // Update the user document so that it includes the image URL.
                userModel.updateOne({
                    _id: userSaved._id
                }, {
                    profilePic: uniqueName
                })
                .then(() => {
                    console.log("User document was updated with the profile picture.");
                    res.redirect("/");
                })
                .catch(err => {
                    console.log(`Error updating the user's profile picture ... ${err}`);
                    res.redirect("/");
                })
            });
        })
        .catch((err) => {
            console.log(`Error adding user to the database ... ${err}`);
            res.redirect("/");
        });
});


// (GET) Route to a registration page
router.get("/login", (req, res) => {
    res.render("user/login");
});

// (POST) Route to a registration page
router.post("/login", (req, res) => {

    // TODO: Validate the form information.

    let errors = [];

    // Search MongoDB for a document with matching email address.
    userModel.findOne({
        email: req.body.email
    })
        .then(user => {
            // Completed the search.
            if (user) {
                // Found the user document.
                // Compare the password supplied by the user with the one in our document.
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched => {
                    // Done comparing the password.

                    if (isMatched) {
                        // Passwords match.

                        // Create a new session by storing the user document (object) to the session.
                        req.session.user = user;

                        res.redirect("/");
                    }
                    else {
                        // Passwords are different.
                        console.log("Passwords do not match.")
                        errors.push("Sorry, your password does not match our database.");

                        res.render("user/login", {
                            errors
                        });
                    }
                })
            }
            else {
                // User was not found in the collection.
                console.log("User not found in the database.");
                errors.push("Email was not found in the database.");

                res.render("user/login", {
                    errors
                });
            }
        })
        .catch(err => {
            // Couldn't query the database.
            console.log(`Error finding the user in the database ... ${err}`);
            errors.push("Oops, something went wrong.");

            res.render("user/login", {
                errors
            });
        });
});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    res.redirect("/user/login");
});

module.exports = router;