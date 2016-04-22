var mongoose = require("mongoose");

// SCHEMA SETUP - defines what campgrounds look like
// doesn't do anything to db. Tells JS that we want to add campgrounds, that look like this, to our db

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// COMPILE SCHEMA INTO MODEL
// Take schema pattern and compile to model. Can use variable for all methods now
// creates collection called "campgrounds" in our db

module.exports = mongoose.model("Campground", campgroundSchema);
