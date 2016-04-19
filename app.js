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
  {name: "Yosemite National Park", image: "http://travelercorner.com/wp-content/uploads/2016/02/Yosemite-Camping.jpg"},
  {name: "Jumbo Rocks Campground", image: "http://cdn.c.photoshelter.com/img-get2/I0000JVhXQ5Wqock/fit=1000x750/Joshua-Tree-0640.jpg"},
  {name: "Crater Lake National Park", image: "http://www.oregonwild.org/sites/default/files/crater-lake-justin-bailie-web.jpg"},
  {name: "North Rim Campground", image: "http://cdn.roughguides.com/wp-content/uploads/2013/06/17.grandCanyon-86497002-1680x1050.jpg"},
  {name: "Death Valley National Park", image: "https://c2.staticflickr.com/2/1311/5147976618_e3150a8532_b.jpg"},
  {name: "White River Campground", image: "https://img.hipcamp.com/image/upload/c_limit,h_1200,q_60,w_1920/v1457727114/campground-photos/cwngj3nr0fzwrlgkatyj.jpg"},
  {name: "Chisos Campground", image: "https://res-4.cloudinary.com/hipcamp/image/upload/c_limit,h_1200,w_1920/v1421954452/ucfrfcqks652jsch0cy6.jpg"},
  {name: "Zion National Park", image: "http://dy7uvfdwot1mj.cloudfront.net/wp-content/uploads/2010/04/zion-park-beyondzion1.jpg"}
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
