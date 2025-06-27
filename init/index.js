// Importing Mongoose for MongoDB connection
const mongoose = require("mongoose");


// Importing the sample data to seed the database
const initData = require("./data.js");


// Importing the Listing model (MongoDB schema)
const Listing = require("../models/listing.js")

// MongoDB connection URL (local database)
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to the database and log the status
main().then(() => {
  console.log("connected to database ");
})
  .catch((err) => {
    console.log(err);
  });


// Async function to handle DB connection using Mongoose
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Function to initialize (seed) the database with sample listings
const initDB = async () => {
  // Check if the database already has listings
  const count = await Listing.countDocuments();

  // If no listings are found, insert the sample data
  if (count === 0) {
    await Listing.insertMany(initData.data);
    console.log("Inserted sample listings.");
  } else {
    // If data already exists, do not duplicate it
    console.log("Database already contains data. Skipped seeding.");
  }
};

// Run the DB seeding function
initDB();