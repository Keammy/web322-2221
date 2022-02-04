const express = require('express');
const router = express.Router();

router.get("/", function(req,res){
    res.render("general/home", {
        title: "Home Page"
    });
});

// setup another route to listen on /about
router.get("/about", function(req,res){
    res.render("general/about", {
        title: "About Page"
    });
});

module.exports = router;