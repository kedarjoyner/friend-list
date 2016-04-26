var express = require("express");
//allows routes to access :id in comment routes
//merges params from campground and comments together
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//automatically requires index.js because of index name
var middleware = require("../middleware");

//COMMENTS NEW
//A comment is dependent on a campgrounds particular id
// When user makes request to add comment and they aren't logged in, will not be able to see comment form
router.get("/new", middleware.isLoggedin, function(req, res){
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//COMMENTS CREATE
//a comment is dependent on a campgrounds particular id
// isLoggedin check if logged in before adding comment
router.post("/", middleware.isLoggedin, function(req, res){
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
              //add username and id to comment
              comment.author.id = req.user._id;
              comment.author.username = req.user.username;
              comment.save(); // save to db
              // push campground into comments array
               campground.comments.push(comment);
               campground.save(); // save to db
               console.log(comment)
;               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// COMMENTS UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.direct("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
