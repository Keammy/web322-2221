const express = require("express");
const exphbs = require("express-handlebars");
const sequelizeModule = require("sequelize");

// Set up Express.
const app = express();

// Set up Handlebars.
app.engine('.hbs', exphbs.engine({
    extname: '.hbs'
}));

app.set("view engine", ".hbs");

// Set up BodyParser
app.use(express.urlencoded({ extended: true}));

// Define the connection to our Postgres instance 
const sequelize = new sequelizeModule("databaseName", "user", "password", {
    host: "hostUrl",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
});

// Define a model for the "Name" table
const nameModel = sequelize.define("Name", {
    fName: sequelizeModule.STRING,   // First Name
    lName: sequelizeModule.STRING    // Last Name
});

// Define our default route (to list the names).
app.get("/", (req, res) => {
    nameModel.findAll({
        order: [ "fName" ]
    }).then(data => {
        // Pull the data (exclusively)
        // This is to ensure that our "data" object contains the returned data (only) and nothing else.
        const names = data.map(value => value.dataValues);

        res.render("viewTable", {
            data: names,
            layout: false  // Do not use the default Layout (main.hbs)
        });
    });
});

// Define a route to update/delete a "Name".
app.post("/updateName", (req, res) => {
    // Check to see if both the first and last names are blank.
    if (req.body.fName.length === 0 && req.body.lName.length === 0) {
        // Delete the record from the database.
        nameModel.destroy({
            where: { id: req.body.id }
        }).then(() => {
            console.log("Successfully deleted the name: " + req.body.id);
            res.redirect("/");
        });
    }
    else {
        // Update the record in the database with new info from req.body.
        nameModel.update({
            fName: req.body.fName,
            lName: req.body.lName
        }, {
            where: { id: req.body.id }
        }).then(() => {
            console.log("Successfully update the name: " + req.body.id);
            res.redirect("/");
        });
    }
});

// Define a route to add a new "name".
app.post("/addName", (req, res) => {
    // Create a record using the "name" model and the data from req.body.
    nameModel.create({
       fName: req.body.fName,
       lName: req.body.lName 
    }).then(() => {
        console.log("Successfully created a new name record.")
        res.redirect("/");
    });
});

// Start listening.
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Syncronize the database, if successful, start the express server.
sequelize.sync()
         .then(() => {
            // Start the server to listen on HTTP_PORT.
            app.listen(HTTP_PORT, onHttpStart);
         });