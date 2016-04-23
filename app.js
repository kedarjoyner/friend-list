var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//dirname is the directly where the file lives in
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"Edward Stark wishes pizza upon the world!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//User.authenticate is a method that comes with passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that adds req.user to every route
app.use(function(req, res, next){
  //pass currentUser to every template
  //locals allows var to be accessed inside of template
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});


//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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
})

// ==================
// COMMENT ROUTES
// ==================

//a comment is dependent on a campgrounds particular id
// when user makes request to add comment and they aren't logged in, will not be able to see comment form
app.get("/campgrounds/:id/comments/new", isLoggedin, function(req, res){
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
app.post("/campgrounds/:id/comments", isLoggedin, function(req, res){
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

// ========================
// AUTHENTICATION ROUTES
// ========================

//show register form
app.get("/register", function(req, res){
  res.render("register");
});
//post route for /register
app.post("/register", function(req, res){
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

// ========================
// LOGIN FORM
// ========================

// show login form
app.get("/login", function(req, res){
  res.render("login");
});

//handling login logic with middleware
//app.post("/login", middleware, callback)
// will call the authenticate method, which was defined up above
// will authenticate the username and password with db
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// ========================
// LOGOUT ROUTE
// ========================

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

app.listen(3000, function(){
   console.log("SERVER HAS STARTED!");
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
