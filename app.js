//Requiring Everything Here
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");


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

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",") ;
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

//Listing route
app.get("/listings", wrapAsync(async (req, res) => {
   const allListings = await Listing.find({});
  
   res.render("listings/index.ejs", {allListings});
}));

//NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//CREATE ROUTE
app.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => {
    
     const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
})
);

//Edit ROute
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id} = req.params;
    const listingData = req.body.listing;
    await Listing.findByIdAndUpdate(id,listingData);
res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.all("*", (req, res, next) => {
//     console.log("404 Triggered at:", req.originalUrl);  // 
//     next(new ExpressError(404, "Page Not Found!"));
// });

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next) => {
   let { statusCode=500, message="Something went wrong!" } = err;
   res.status(statusCode).render("listings/error.ejs", { message });
//    res.status(statusCode).send(message);
});

