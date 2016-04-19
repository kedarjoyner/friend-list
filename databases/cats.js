// mongoose is a way to write JS in our JS files that talks with our database.

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat-app");

// Define scheme/pattern for what a cat looks like
var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

// Take catSchema and compile it into a model that contains a bunch of methods. Saves to Cat. Convention to be capital letter
// Will work with this variable for all of our methods
// Takes collection "Cat" and pluralizes it into Cats.
// String ("Cat") must always be singular
var Cat = mongoose.model("Cat", catSchema);

// adding a new cat to the DB
// george variable doesn't matter, it's just how we refer to it inside of code

  // var george = new Cat({
  //   name: "Mrs. Norris",
  //   age: 7,
  //   temperament: "Evil"
  // });


// combines find and create all into one
Cat.create({
  name: "Stephen",
  age: 15,
  temperament: "Totally Awesome"
}, function(err, cat){
    if(err) {
      console.log(err);
    } else {
      console.log(cat);
    }
});


// save george to monogo database
// callback function to check for errors
// cat is referring to what's coming from the database

  // george.save(function(err, cat){
  //   if(err){
  //     console.log("SOMETHING WENT WRONG!");
  //   } else {
  //     console.log("WE JUST SAVED A CAT AT TO THE DB:");
  //     console.log(cat);
  //   }
  // });

//retrieve all cats from the DB and console.log each one

Cat.find({}, function(err, cats){
  if(err){
    console.log("OH NO, ERROR!");
    consolelog(err);
  } else {
    console.log("ALL THE CATS....");
    console.log(cats);
  }
});
