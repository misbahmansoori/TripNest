const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

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

const initDB = async () => {
  const count = await Listing.countDocuments();
  if (count === 0) {
    await Listing.insertMany(initData.data);
    console.log("Inserted sample listings.");
  } else {
    console.log("Database already contains data. Skipped seeding.");
  }
};


initDB();