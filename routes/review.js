const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js"); // ✅ You must add this line
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const mongoose = require("mongoose");


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


// REVIEWS Storing Reviews for particular listings
//POST ROUTE
router.post("/", validateReview, wrapAsync(async(req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review added")
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: new mongoose.Types.ObjectId(reviewId)}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;