const express = require("express");
const session = require('express-session');
const exphbs = require("express-handlebars");

// Set up express
const app = express();

// Set up handlebars
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: ''
}));

app.set('view engine', '.hbs');

// Set up express-session
app.use(session({
    secret: "this_is_very_secret",
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // res.locals.user is a global handlebars variable.
    // This means that ever single handlebars file can access that user variable
    res.locals.user = req.session.user;
    next();
});

// Set up a faux song database
const songs = [
    {
        id: 1,
        name: "Life Goes On",
        artist: "BTS",
        price: 0.99
    },
    {
        id: 2,
        name: "Mood",
        artist: "24kGoldn Featuring Ian Dior",
        price: 0.50
    },
    {
        id: 3,
        name: "Positions",
        artist: "Ariana Grande",
        price: 0.99
    }
];

// Find a song from the faux database.
const findSong = function (id) {
    return songs.find((song) => {
        return song.id == id
    });
};


// Prepare the view model.
const VIEW_NAME = "musicstore";

const prepareViewModel = function (req, message) {

    if (req.session && req.session.user) {
        // A session was established and the user is signed in.

        let cart = req.session.cart || [];
        let cartTotal = 0;

        // Check if the cart has any songs.
        const hasSongs = cart.length > 0;

        // If there are songs in the shopping cart, then calculate the order total.
        if (hasSongs) {
            cart.forEach(cartSong => {
                cartTotal += cartSong.song.price * cartSong.qty;
            });
        }

        return {
            hasSongs,
            cartTotal: "$" + cartTotal.toFixed(2),
            songs: cart,
            message
        };
    }
    else {
        // User is not signed in, return default information.
        return {
            hasSongs: false,
            cartTotal: "$0.00",
            songs: [],
            message
        };
    }
}

// Default home route.
app.get("/", (req, res) => {
    res.render(VIEW_NAME, prepareViewModel(req));
});

// Route to add a new song to the shopping cart.
// The ID of the song will be specified as part of the URL.
app.get("/add-song/:id", (req, res) => {

    let message;
    const songId = req.params.id;

    if (req.session.user) {
        // The user is signed in.

        // A shopping cart item will look like this:
        //    id: ID of the song.
        //    qty: Number of purchases for this song.
        //    song: The details about the song (for displaying in cart).

        // Find the song in the "fake" database.
        let song = findSong(songId);
        let cart = req.session.cart = req.session.cart || [];

        if (song) {
            // Song was found in the database.
            // Search the shopping cart to see if the song is already added.
            let found = false;

            cart.forEach(cartSong => {
                if (cartSong.id == songId) {
                    // Song was already in the shopping cart, increment the quantity.
                    found = true;
                    cartSong.qty++;
                }
            });

            if (found) {
                message = "Song was already in the cart, incremented the quantity by one.";
            }
            else {
                // Song was not found in the shopping cart. Create a new shopping cart object
                // and add it to the cart.
                cart.push({
                    id: songId,
                    qty: 1,
                    song
                });

                // Logic to sort the cart by artist name.
                cart.sort((a, b) => a.song.artist.localeCompare(b.song.artist));

                message = "Song added to the shopping cart."
            }
        }
        else {
            // Song was not found in the database.
            message = "Song was not found in the database."
        }
    }
    else {
        // The user is not signed in.
        message = "You must be logged in."
    }

    res.render(VIEW_NAME, prepareViewModel(req, message));
});

app.get("/remove-song/:id", (req, res) => {

    let message;
    const songId = req.params.id;

    if (req.session.user) {
        // The user is signed in.

        let cart = req.session.cart || [];

        // Find the song in the shopping cart.
        const index = cart.findIndex(cartSong => cartSong.id == songId);

        if (index >= 0) {
            // Song was found in the shopping cart.
            message = `Removed "${cart[index].song.name}" from the cart`;
            cart.splice(index, 1);
        }
        else {
            // Song was not found, nothing to do.
            message = "Song was not found in your cart."
        }
    }
    else {
        // The user is not signed in.
        message = "You must be logged in."
    }

    res.render(VIEW_NAME, prepareViewModel(req, message));
});

app.get("/check-out", (req, res) => {

    let message;

    if (req.session.user) {
        let cart = req.session.cart || [];

        if (cart.length > 0) {
            // There are items in the cart, check-out the user.
            message = "Thank you for your purchase, you are now checked out.";

            // Don't want to do this:
            // req.session.destroy();

            req.session.cart = [];
        }
        else {
            // There are no items in the cart.
            message = "You cannot check-out, there are no items in the cart.";
        }
    }
    else {
        // The user is not signed in.
        message = "You must be logged in."
    }

    // Render the view
    res.render(VIEW_NAME, prepareViewModel(req, message));

});

app.get("/login", (req, res) => {

    let message;

    if (req.session.user) {
        // User is already logged in.
        message = `${req.session.user.name} is already logged in.`;
    }
    else {
        // Create a new user object and start the session.
        // This is normally pulled from the database and not hard-coded.
        req.session.user = {
            name: "Nick",
            vip: true
        };

        // Update the user global variable since we are not using res.redirect().
        res.locals.user = req.session.user;

        message = "You are logged in";
    }

    // Render the view
    res.render(VIEW_NAME, prepareViewModel(req, message));
});

app.get("/logout", (req, res) => {

    let message;

    if (req.session.user) {
        // User is already logged in.
        message = "You have been logged out.";

        // Update the user global variable since we are not using res.redirect().
        res.locals.user = undefined;

        req.session.destroy();
    }
    else {
        // User not logged in.
        message = "You are not logged in.";
    }

    // Render the view
    res.render(VIEW_NAME, prepareViewModel(req, message));
});

// Start the express web server and begin listening for requests.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Web server started on port ${PORT}.`);
});