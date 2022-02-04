const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");

var app = express();

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    defaultLayout: "main"
}));

app.set('view engine', '.hbs');

app.use(express.static(__dirname + "/public"));

// Load the controllers into Express
const generalController = require("./controllers/general");
const employeeController = require("./controllers/employee");

app.use("/", generalController);
app.use("/employee", employeeController);

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);