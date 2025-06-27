// Requiring Everything Here
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Mongoose model for listings
const wrapAsync = require("./utils/wrapAsync.js"); // Utility to handle async errors
const ExpressError = require("./utils/ExpressError.js"); // Custom error handler
const { listingSchema, reviewSchema } = require("./schema.js"); // JOI validation schema
const Review = require("./models/review.js");

const methodOverride = require("method-override"); // To support PUT & DELETE methods via forms
const ejsMate = require("ejs-mate"); // Layout engine for EJS

const path = require("path");

// Serving static files (like CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, "/public")));

// Setting up EJS as the view engine and specifying views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to override HTTP methods using query parameter ?_method=PUT or DELETE
app.use(methodOverride("_method"));

// Using ejs-mate to enable layouts in EJS
app.engine('ejs', ejsMate);


// Connecting Database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to database ");
})
    .catch((err) => {
        console.log(err);
    });

// Async function to connect to MongoDB
async function main() {
    await mongoose.connect(MONGO_URL);
}


// Setting up the Port
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});


// Basic API set up
app.get("/", (req, res) => {
    res.send("working don't worry"); // Root route test
});


// Middleware to validate listings before creating/updating
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validate form data
    if (error) {
        // Join all error messages into a single string
        let errMsg = error.details.map((el) => el.message).join(",");
        // Throw custom error
        throw new ExpressError(400, errMsg);
    } else {
        next(); // Move to the next middleware/route
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Validate form data
    if (error) {
        // Join all error messages into a single string
        let errMsg = error.details.map((el) => el.message).join(",");
        // Throw custom error
        throw new ExpressError(400, errMsg);
    } else {
        next(); // Move to the next middleware/route
    }
};


// Listing route - Index page to show all listings
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// NEW route - Form to create a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show route - View a single listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));


// CREATE route - Adds new listing to database
app.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing); // Form data structure: { listing: { ... } }
        await newListing.save();
        res.redirect("/listings");
    })
);


// Edit route - Form to edit an existing listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));


// Update route - Save changes to an existing listing
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = req.body.listing; // Destructure edited listing from form
    await Listing.findByIdAndUpdate(id, listingData);
    res.redirect(`/listings/${id}`);
}));


// Delete route - Remove a listing from the database
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


// REVIEWS Storing Reviews for particular listings
//POST ROUTE
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: new mongoose.Types.ObjectId(reviewId)}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
})
);



// Catch-all route for any undefined path (404 error)
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// Global error handler middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    // Optional alternative: send plain text message instead of rendering
    // res.status(statusCode).send(message);
});
