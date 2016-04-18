var express = require("express");
var app = express();

// include public directory
app.use(express.static("public"));

// include ejs files
app.set("view engine", "ejs");

// home page
app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  var campgrounds = [
    {name: "Yosemite National Park", image: "https://unsplash.it/300?image=1044"},
    {name: "Joshua Tree National Park", image: "https://unsplash.it/300?image=1011"},
    {name: " Zion National Park", image: "https://unsplash.it/300?image=1016"}
  ]
  res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen(3000, function() {
  console.log("The YelpCamp Server has started!");
});
