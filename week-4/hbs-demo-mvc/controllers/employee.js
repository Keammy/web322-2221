const express = require('express');
const router = express.Router();
const employeeList = require("../models/employeeList");

router.get("/", function(req,res){
    res.render("employee/list", {
        employees: employeeList.getAllEmployees(),
        title: "Employee List"
    });
});

router.get("/create", function(req,res){
    res.render("employee/list", {
        employees: employeeList.getVisibleEmployees(),
        title: "Employee List"
    });
});

router.get("/edit", function(req,res){
    res.render("employee/list", {
        employees: employeeList.getVisibleEmployees(),
        title: "Employee List"
    });
});

module.exports = router;