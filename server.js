const dotenv = require("dotenv");
var mongoose = require("mongoose");
var express = require("express");
const path = require("path");
// var router = express.Router();
const ejs = require("ejs");
const bodyParser = require("body-parser");
// var md5 = require('md5');
const session = require("express-session");
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/db");
const User = db.User;





var PORT = process.env.PORT || 8082;
dotenv.config({ path: "./.env" });

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Import routes and give the server access to them.
var routes = require("./controllers/sciController.js");


//initialize session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
    
  }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());





app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT + "/");
});
