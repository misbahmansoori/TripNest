// Requiring Everything Here
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");


const ExpressError = require("./utils/ExpressError.js"); // Custom error handler
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// Basic API set up
app.get("/", (req, res) => {
    res.send("working don't worry"); // Root route test
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });


//     let registerUser = await User.register(fakeUser, "helloworld");
//     res.send(registerUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use(userRouter); 






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
