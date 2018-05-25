// ====== LOCATION ROUTES  ====== //

var express = require("express");
var router = express.Router();
var Location = require("../models/location");
var middleware = require("../middleware");

//INDEX
router.get("/locations", function(req, res) {
    //Get all locations from DB
    Location.find({}, function(err, allLocations) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("locations/index", {locations: allLocations});
        }
    });
});

//NEW
router.get("/locations/new", middleware.isLoggedIn, function(req, res) {
    res.render("locations/new");
});

//CREATE
router.post("/locations", middleware.isLoggedIn, function(req, res) {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newLocation = {name: name, image: image, description: desc, author: author}
    
    //creare new location and add to DB
    Location.create(newLocation ,function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to locations page
            console.log(newlyCreated);
            res.redirect("/locations");
        }
    });
});

//SHOW - shows more info about one location
router.get("/locations/:id", function(req, res) {
    //find location with provided ID
    Location.findById(req.params.id).populate("comments").exec(function(err, foundLocation) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that location
            res.render("locations/show", {location: foundLocation});
        }
    });
});

//EDIT LOCATION
router.get("/locations/:id/edit", middleware.checkLocationOwnership,function(req, res) {
    Location.findById(req.params.id, function(err, foundLocation) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("locations/edit", {location: foundLocation})
        }
    });
});

//UPDATE LOCATION
router.put("/locations/:id", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newData = {name: name, image: image, description: desc};
    
    //find and update location
    Location.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedLocation) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully updated!");
            res.redirect("/locations/" + req.params.id);
        }
    });
});

//DELETE LOCATION
router.delete("/locations/:id", middleware.checkLocationOwnership, function(req, res) {
    Location.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/locations");
        }
        else {
            req.flash("success", "Location was successfully deleted!");
            res.redirect("/locations");
        }
    });
});

module.exports = router;