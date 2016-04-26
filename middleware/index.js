var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here!
var middlewareObj = {};

// Authorization to ensure users are logged in and can only edit their own posts.
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                //does user own the campground?
                //foundCampground is passed in under the name of campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//Authorization to ensure users are logged in and can only edit their own posts.
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            //does user own the comment?
            //foundComment is passed in under the name of campground
            // can't do triple equals otherwise String vs Object
            if (foundComment.author.id.equals(req.user._id)) {
              next();
            } else {
                res.redirect("back");
            }
        }
    });
} else {
    res.redirect("back");
  }
}


// If we want a user to be signed in to access a particular page
// then put this on whatever route necessary
middlewareObj.isLoggedin = function(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj;
