var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")

//requiring routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

//environment variables. hide our login details
mongoose.connect(process.env.DATABASEURL);
console.log(process.env.DATABASEURL);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//dirname is the directly where the file lives in
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database


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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//all start with slash. Don't have to physically hange anything in index - doing this to follow structure of others below
app.use("/", indexRoutes);
//appends /campgrounds in front of our campgrounds routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(port, function(){
   console.log("SERVER HAS STARTED!");
});
