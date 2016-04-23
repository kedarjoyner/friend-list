var express = require("express");
//allows routes to access :id in comment routes
//merges params from campground and comments together
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ==================
// COMMENT ROUTES
// ==================

//a comment is dependent on a campgrounds particular id
// when user makes request to add comment and they aren't logged in, will not be able to see comment form
router.get("/new", isLoggedin, function(req, res){
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//a comment is dependent on a campgrounds particular id
// isLoggedin check if logged in before adding comment
router.post("/", isLoggedin, function(req, res){
   //lookup correct campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
         // comment argument holds all objects in comment variable
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
              // push campground into comments array
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// Middleware for isLoggedin
// If we want a user to be signed in to access a particular page
// then put this on whatever route necessary
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
