// Importing Mongoose to define a schema and model
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Shortcut to access Mongoose's Schema class
const Review = require("./review.js")

// Defining the structure of a "Listing" document using Mongoose schema
const listingSchema = new Schema({
  title: {
    type: String,     // Title must be a string
    required: true,   // Title is required — cannot be empty
  },
  description: String, // Optional description of the listing

  image: {
    type: String,     // URL of the image
    default:          // Default image if none provided
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    
    // The `set` function checks if the user submitted an empty string
    // If yes, it replaces it with the default image URL
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
  },

  price: Number,     // Price of the listing
  location: String,  // Specific location (e.g., city)
  country: String,   // Country of the listing
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
     await Review.deleteMany({_id: {$in: listing.reviews}});
  }
 
});

// Creating the Mongoose model named "Listing" using the schema
const Listing = mongoose.model("Listing", listingSchema);

// Exporting the model to use in other parts of the app
module.exports = Listing;
