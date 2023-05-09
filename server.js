const dotenv = require("dotenv");
var request = require("request");
var mongoose = require("mongoose");
var express = require("express");
const path = require("path");
const session = require("express-session");
var router = express.Router();
const ejs = require("ejs");
const bodyParser = require("body-parser");

var PORT = process.env.PORT || 8082;
dotenv.config({ path: "./.env" });

var app = express();
// mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true }); //test
// connection moved to config.json  5-8-2023

// schemas + user/vessel/pickup
// moved schemas to db.js  5-8-2023
// end schemas + user/vessel/pickup


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
app.use(routes);

app.use(
  session({
    secret: "nodejs",
    resave: true,
    saveUninitialized: true,
  })
);

// Create all our routes and set up logic within those routes where required.
// moved the routes to sci-controller 5-8-2023

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT + "/home");
});
