var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose");

// create yelpcamp database in mongodb
mongoose.connect("mongodb://localhost/yelp_camp");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

// COMPILE SCHEMA INTO MODEL
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//       name: "Crater Lake National Park",
//       image:"http://www.oregonwild.org/sites/default/files/crater-lake-justin-bailie-web.jpg"
//
//     },
//     function(err, campground) {
//       if(err){
//         console.log(err);
//       } else {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//       }
// });

// include body parser package
app.use(bodyParser.urlencoded({extended:true}));

// include public directory
app.use(express.static("public"));

// include ejs files
app.set("view engine", "ejs");


// home page
app.get("/", function(req, res){
  res.render("landing");
});


// RETRIEVE FROM DB AND SHOW ALL CAMPGROUNDS ON CAMPGROUNDS.EJS
app.get("/campgrounds", function(req, res){
// Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      // db will refer to them as campgrounds
      // allCampgrounds is defined
      res.render("campgrounds", {campgrounds:allCampgrounds});
    }
  });
});

// diff then above url because this is post, not get
// this follows REST convention
// the route where you can create a new campground

// MAKES NEW CAMPGROUND OBJECT
// SAVES TO DB
// IF NOT ERROR, PASSES CAMPGROUND GET WHERE IT'S DISPLAYED ON PAGE

app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  // push new campgrounds into campground array
  var newCampground = {name: name, image: image};
  // Create new campground and save to DB
  // If this works, wIll then run code above in GET
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect to campgrounds page
      res.redirect("/campgrounds");
    }
  });
  // campgrounds.push(newCampground);
});

//shows the form that sends the data to the above post route
app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

app.listen(3000, function() {
  console.log("The YelpCamp Server has started!");
});
