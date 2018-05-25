var express = require("express");
var router = express.Router({mergeParams: true}); //this will merge params from campground and comments to find ID
var Location = require("../models/location");
var Comment  = require("../models/comment");
var middleware = require("../middleware");

// ===== COMMENTS ROUTES ===== //

//NEW
router.get("/locations/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {location: location});
        }
    });
});

//CREATE 
router.post("/locations/:id/comments", middleware.isLoggedIn, function(req, res) {
    //look up location by ID
    Location.findById(req.params.id, function(err, location) {
        if (err) {
            console.log(err);
            res.redirect("/locations");
        }
        else {
            var text = req.body.text;
            var author = req.body.author;
            var newComment = {text: text, author: author};
            //create a comment
            Comment.create(newComment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong...");
                    console.log(err);
                }
                else {
                    //assigns the author to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    //adds the comment to the location and saves
                    location.comments.push(comment);
                    location.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/locations/" + location._id);
                }
            });
        }
    });
});

//EDIT
router.get("/locations/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {location_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE
router.put("/locations/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

//DESTROY 
router.delete("/locations/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment deleted!");
            res.redirect("/locations/" + req.params.id); //brings back to show page
        }
    });
});


module.exports = router;