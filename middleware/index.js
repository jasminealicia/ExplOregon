var Location = require("../models/location");
var Comment = require("../models/comment");
//all middleware goes here
var middlewareObj = {};

middlewareObj.checkLocationOwnership = function(req, res, next) {
    //is the user loggin?
    if (req.isAuthenticated()) {
        Location.findById(req.params.id, function(err, foundLocation) {
            if (err) {
                req.flash("error", "Location not found...");
                res.redirect("back");
            }
            else {
                //does user own location?
                if (foundLocation.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    //otherwise, redirect
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        //if not, redirect
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back"); //takes them back to previous page they were on
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                //does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    //otherwise, redirect
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back");
                }
            }
        });
    }
    else {
        //if not, redirect
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;