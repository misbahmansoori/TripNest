// Importing Mongoose to define a schema and model
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Shortcut to access Mongoose's Schema class
const Review = require("./review.js")

// Defining the structure of a "Listing" document using Mongoose schema
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  category: String, 
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
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
