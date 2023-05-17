const dotenv = require("dotenv");
const methodOverride = require("method-override");
// var mongoose = require("mongoose");
var express = require("express");
const app = express();
const path = require("path");
// const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

// Import routes and give the server access to them.
const routes = require("./controllers/sciController.js");

dotenv.config({ path: "./.env" });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

//middleware for  method override
app.use(methodOverride("_method"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware for express session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
//middleware for connect flash
app.use(flash());

//Setting messages variables globally
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(routes);

var PORT = process.env.PORT || 8082;
app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT + "/");
});
