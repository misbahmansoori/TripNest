const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Utility to handle async errors
const { reviewSchema } = require("../schema.js"); // JOI validation schema
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// Middleware to validate listings before creating/updating

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing,
    wrapAsync(listingController.createListing)
);


// NEW route - Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.get('/search', wrapAsync(listingController.searchListings));

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,
    isOwner,
    validateListing,
    upload.single('listing[image]'),
     wrapAsync(listingController.updateForm))
.delete( isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));




// Edit route - Form to edit an existing listing
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;