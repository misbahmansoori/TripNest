const Listing = require("../models/listing");
const mongoose = require("mongoose");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListings;

    if (category) {
        const regex = new RegExp(category, "i");
        allListings = await Listing.find({ category: regex });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" },
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const { location } = req.body.listing;

        const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: location,
                format: 'json'
            },
            headers: {
                'User-Agent': 'TripNestApp'
            }
        });

        let coordinates = [0, 0];
        if (geoResponse.data && geoResponse.data.length > 0) {
            const place = geoResponse.data[0];
            coordinates = [parseFloat(place.lon), parseFloat(place.lat)];
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        newListing.geometry = {
            type: "Point",
            coordinates: coordinates
        };

        await newListing.save();
        req.flash("success", "New Listing Created!");
        return res.redirect("/listings");

    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Something went wrong while creating the listing.");
        return res.redirect("/listings");
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.updateForm = async (req, res) => {
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await updatedListing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.redirect("/listings");
    }

    const regex = new RegExp(q, "i"); // case-insensitive

    const listings = await Listing.find({
        $or: [
            { title: regex },
            { description: regex },
            { location: regex },
            { country: regex }
        ]
    });

    res.render("listings/index", { allListings: listings });
};

