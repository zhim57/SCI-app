const dotenv = require("dotenv");
var request = require("request");
var mongoose = require("mongoose");
var express = require("express");
const path = require("path");
const session = require("express-session");
var router = express.Router();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const AES = require("mysql-aes");
const encrypt = require("mongoose-encryption");

var PORT = process.env.PORT || 8082;
dotenv.config({ path: "./.env" });

var app = express();
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  u_email: String,
  u_password: String,
  u_vessel: String,
  u_last_name: String,
  u_first_name: String,
  u_cell: String,
  u_role: String,
  u_whatsApp: String,
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  outWard: { type: Boolean, default: false },
  inWard: { type: Boolean, default: false },
});

const User = new mongoose.model("User", userSchema);

const pickupSchema = new mongoose.Schema({
  crew_first_name: String,
  crew_last_name: String,
  crew_email: String,
  port_location: String,
  crew_whatsApp: String,
  pickUp: String,
  crew_cell: String,
  dropOff: String,
  numberPass: Number,
  remarks: String,
  lastMessageTo: String,
  reLastMessageFrom: String,
  verificationCode: String,
  driver: String,
  vehicle: String,
  vehicle_cell: String,
  dispatcher: String,
  driverReview: String,
  passengerReview: String,
  driverScore: String,
  passengerScore: String,

  dateJa: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  cancelled: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
});

const Pickup = new mongoose.model("pickup", pickupSchema);

// Add any other plugins or middleware here. For example, middleware for hashing passwords

var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["u_password"]});


console.log(process.env.SECRET);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Import routes and give the server access to them.
// var routes = require("./controllers/sciController1.js");
// var routes = require("./controllers/sciController.js");

// app.use(routes);

app.use(
  session({
    secret: "nodejs",
    resave: true,
    saveUninitialized: true,
  })
);


// Create all our routes and set up logic within those routes where required.

app.get("/home", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  // console.log(req.body);
  const check = req.body.u_email;
  const newUser = new User({
    u_email: req.body.u_email,
    u_password: req.body.password,
    u_vessel: req.body.u_vessel,
    u_last_name: req.body.u_last_name,
    u_first_name: req.body.u_first_name,
    u_cell: req.body.u_cell,
    u_role: req.body.u_role,
    u_whatsApp: req.body.u_whatsApp,
  });

  const foundPreviousUser = await User.find({ u_email: check });
  console.log(foundPreviousUser);

  if (foundPreviousUser[0] === undefined) {
    // console.log(newUser);
    const result1 = await newUser.save();
    console.log(result1);
    res.render("seafarer");
  } else if (foundPreviousUser[0].u_email === check) {
    data = {
      remarks:
        "Hello " +
        foundPreviousUser[0].u_first_name +
        ",  your email is already on file , please log in!",
      u_email: check,
      u_first_name: foundPreviousUser[0].u_first_name,
    };

    res.render("login", { data: data });
  }
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  loggedUser = {
    u_email: req.body.username,
  };

  user.read4(
    { table: "sci_users", cond: "u_email", u_email: username },
    function (foundUser, err) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser[0].u_password === password) {
            loggedUser.id = foundUser[0].id;
            loggedUser.u_first_name = foundUser[0].u_first_name;
            loggedUser.u_last_name = foundUser[0].u_last_name;
            loggedUser.u_whatsApp = foundUser[0].u_whatsApp;
            loggedUser.u_cell = foundUser[0].u_cell;
            loggedUser.u_vessel = foundUser[0].u_vessel;
            loggedUser.u_role = foundUser[0].u_role;

            console.log("loggedUser");
            console.log(loggedUser);

            if (loggedUser.u_role === "seafarer") {
              res.render("seafarer");
            } else if (loggedUser.u_role === "driver") {
              res.render("driver");
            } else if (loggedUser.u_role === "dispatcher") {
              res.render("dispatcher");
            } else if (loggedUser.u_role === "admin") {
              res.render("dispatcher");
            }
          }
        } else {
          console.log("no foundUser ?");
        }
      }
    }
  );
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT + "/home");
});
