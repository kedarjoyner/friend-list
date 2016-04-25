var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


// ========================
// AUTHENTICATION ROUTES
// ========================

//show register form
router.get("/register", function(req, res){
  res.render("register");
});

//handles registration logic
router.post("/register", function(req, res){
  //method we can use on User via passport-local-mongoose
  //pass in password as second argument
  var newUser = new User({username: req.body.username});
  // user will hold the username and hashed password for newly registered user
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    // log user in
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// show login form
router.get("/login", function(req, res){
  res.render("login");
});

//handling login  with middleware
//app.post("/login", middleware, callback)
// will call the authenticate method, which was defined up above
// will authenticate the username and password with db
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
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
