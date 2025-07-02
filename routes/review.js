const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const mongoose = require("mongoose");

const reviewController = require("../controllers/reviews.js");

// POST review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE review route
router.delete("/:reviewId",
    isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
