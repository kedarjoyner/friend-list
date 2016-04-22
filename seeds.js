var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Cronut fixie hashtag YOLO, taxidermy skateboard kogi pabst irony. Flexitarian 90's heirloom narwhal. Mixtape cliche YOLO fanny pack, tofu crucifix polaroid sriracha messenger bag kinfolk 90's jean shorts. Banjo mlkshk letterpress marfa. Craft beer salvia health goth, bicycle rights post-ironic poutine four loko umami venmo lomo iPhone narwhal blog. Try-hard waistcoat semiotics artisan, helvetica mustache stumptown fingerstache health goth wolf art party. Humblebrag asymmetrical skateboard celiac."
    },
    {
        name: "Desert Mesa",
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "Cronut fixie hashtag YOLO, taxidermy skateboard kogi pabst irony. Flexitarian 90's heirloom narwhal. Mixtape cliche YOLO fanny pack, tofu crucifix polaroid sriracha messenger bag kinfolk 90's jean shorts. Banjo mlkshk letterpress marfa. Craft beer salvia health goth, bicycle rights post-ironic poutine four loko umami venmo lomo iPhone narwhal blog. Try-hard waistcoat semiotics artisan, helvetica mustache stumptown fingerstache health goth wolf art party. Humblebrag asymmetrical skateboard celiac."
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Cronut fixie hashtag YOLO, taxidermy skateboard kogi pabst irony. Flexitarian 90's heirloom narwhal. Mixtape cliche YOLO fanny pack, tofu crucifix polaroid sriracha messenger bag kinfolk 90's jean shorts. Banjo mlkshk letterpress marfa. Craft beer salvia health goth, bicycle rights post-ironic poutine four loko umami venmo lomo iPhone narwhal blog. Try-hard waistcoat semiotics artisan, helvetica mustache stumptown fingerstache health goth wolf art party. Humblebrag asymmetrical skateboard celiac."
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
