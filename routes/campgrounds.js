var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
//why is this okay for it to be just /?
router.get("/", function(req, res){
  // contains all the infomration about the user
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", isLoggedin, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", isLoggedin, function(req, res){
   res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    // populate the comments on that campground
    // .exec executes the query we just made
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      //foundCampground is passed in under the name of campground
        res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
  //find and update the correct campground
  // req.body.campground contains name, image, descrip by default
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
  //redirect somewhere
});




//MIDDLEWARE
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
