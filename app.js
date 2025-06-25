//Requiring Everything Here
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


//Connecting Database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to database ");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

//Setting up the Port
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

//Basic API set up
app.get("/", (req, res) => {
    res.send("working don't worry");
    
});

//Listing route
app.get("/listings", async (req, res) => {
   const allListings = await Listing.find({});
  
   res.render("listings/index.ejs", {allListings});
});

//NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//CREATE ROUTE
app.post("/listings", async (req, res) => {
 const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});

//Edit ROute
app.get("/listings/:id/edit", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id} = req.params;
    const listingData = req.body.listing;
    await Listing.findByIdAndUpdate(id,listingData);
res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// test api
// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "America",
//         country: "USA"
//     });

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("Successfully saved");
// });