var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// include body parser package
app.use(bodyParser.urlencoded({extended:true}));

// include public directory
app.use(express.static("public"));

// include ejs files
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Yosemite National Park", image: "https://unsplash.it/300?image=1044"},
  {name: "Joshua Tree National Park", image: "https://unsplash.it/300?image=1011"},
  {name: " Zion National Park", image: "https://unsplash.it/300?image=1016"}
]

// home page
app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds:campgrounds});
});

// diff then above url because this is post, not get
// this follows REST convention
// the route where you can create a new campground
app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  // push new campgrounds into campground array
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  // default redirects to GET
  res.redirect("/campgrounds");
});

//shows the form that sends the data to the above post route
app.get("/campgrounds/new", function(req, res){
  res.render("new.ejs");
});

app.listen(3000, function() {
  console.log("The YelpCamp Server has started!");
});
