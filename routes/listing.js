const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to handle async errors
const { listingSchema, reviewSchema } = require("../schema.js"); // JOI validation schema
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


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

// Listing route - Index page to show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// NEW route - Form to create a new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show route - View a single listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));


// CREATE route - Adds new listing to database
router.post("/", validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing); // Form data structure: { listing: { ... } }
        await newListing.save();
        req.flash("success", "New Listing Created!");
        return res.redirect("/listings");
    })
);


// Edit route - Form to edit an existing listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));


// Update route - Save changes to an existing listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = req.body.listing; // Destructure edited listing from form
    await Listing.findByIdAndUpdate(id, listingData);
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}));


// Delete route - Remove a listing from the database
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));


module.exports = router;