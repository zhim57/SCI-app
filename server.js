const dotenv = require("dotenv");
var request = require("request");
var mongoose = require("mongoose");
var express = require("express");
const path = require("path");
const session = require("express-session");
// var router = express.Router();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

var PORT = process.env.PORT || 8082;
dotenv.config({ path: "./.env" });

var app = express();
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const vesselSchema = new mongoose.Schema({
  v_name: String,
  v_email: String,
  v_imo: String,
  v_code: String,
 
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  outWard: { type: Boolean, default: false },
  inWard: { type: Boolean, default: false },
});

// Add any other plugins or middleware here. For example, middleware for hashing passwords
var secret = process.env.SECRET;
vesselSchema.plugin(encrypt, { secret: secret, encryptedFields: ["v_email","v_code"] });

const Vessel = new mongoose.model("Vessel", vesselSchema);

const userSchema = new mongoose.Schema({
  u_email: String,
  u_password: String,
  u_vessel: String,
  u_vessel_imo: String,
  u_last_name: String,
  u_first_name: String,
  u_cell: String,
  u_role: String,
  u_whatsApp: String,
  u_code:String,
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  outWard: { type: Boolean, default: false },
  inWard: { type: Boolean, default: false },
});

// Add any other plugins or middleware here. For example, middleware for hashing passwords
var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["u_password"] });

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

const Pickup = new mongoose.model("Pickup", pickupSchema);

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
app.get("/vessel_input", function (req, res) {
  res.render("vessel_input");
});

app.post("/register", async function (req, res) {
  // console.log(req.body);
  const check = req.body.u_email;
  const v_imo = req.body.u_vessel_imo;
  const newUser = new User({
    u_email: req.body.u_email,
    u_password: req.body.u_password,
    u_vessel: req.body.u_vessel,
    u_vessel_imo: req.body.u_vessel_imo,
    u_last_name: req.body.u_last_name,
    u_first_name: req.body.u_first_name,
    u_cell: req.body.u_cell,
    u_role: req.body.u_role,
    u_whatsApp: req.body.u_whatsApp,
    u_code: req.body.u_code,
  });
  const foundPreviousUser = await User.find({ u_email: check });
  const foundVessel = await Vessel.find({ v_imo: v_imo });



  // console.log(newUser);
  // console.log(foundVessel);
  // console.log(foundPreviousUser[0]);

  // console.log("checked1");
  if ((foundPreviousUser[0] === undefined)  && (foundVessel[0].v_code=== newUser.u_code))  {
  // console.log("checked");
    const result1 = await newUser.save();
    // console.log(result1);
    data = {
      remarks:
        "Hello " +
       result1.u_first_name +
        ", thank you for registering , please log in!",
      u_email: check,
      u_first_name: newUser.u_first_name,
    };
    res.render("login", { data: data });
  }
 else if ((foundPreviousUser[0] === undefined)  && (foundVessel[0].v_code!= newUser.u_code))  {


    data = {
      remarks:
        "Hello " +
      newUser.u_first_name +
        ", registration failed, wrong verification code!",
      u_email: check,
      u_first_name: newUser.u_first_name,
    };
    res.render("confirmation", { data: data });
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
app.post("/vessel_input", async function (req, res) {
  // console.log(req.body);
  const v_name= req.body.v_name;
  const v_imo = req.body.v_imo;
  const v_code = req.body.v_code;
  const newVessel = new Vessel({
    v_name: req.body.v_name,
    v_imo: req.body.v_imo,
    v_email: req.body.v_email,
    v_code: req.body.v_code
  });
  const foundVessel = await Vessel.find({ v_imo: v_imo });

  console.log(foundVessel);

  if (foundVessel[0]=== undefined ) {
    
    const result1 = await newVessel.save();
    console.log(result1);
    data = {
      remarks:
      "Hello , vessel name :" +result1.v_name + "vessel imo: " +   result1.v_imo + " ver code :   " +   result1.v_code  + 
      ", thank you for registering this vessel!",
      
    };
    res.render("confirmation", { data: data });
  } else if (foundVessel[0].v_imo=== v_imo) {
    data = {
      remarks:
      "Hello " +
      foundVessel[0].v_imo +
      ",  this imo  is already in database, we ve sent the verification code to the ship's email on record!",
      v_imo: foundVessel[0].v_imo,
      v_name: foundVessel[0].v_name
    };
    res.render("confirmation", { data: data });
  }
});

app.post("/login", async function (req, res) {
  const u_email = req.body.u_email;
  const u_password = req.body.u_password;
  loggedUser = {
    u_email: req.body.u_email,
  };

  const foundPreviousUser = await User.find({ u_email: u_email });
  console.log(foundPreviousUser);

  if (
    foundPreviousUser[0].u_email === loggedUser.u_email &&
    foundPreviousUser[0].u_password === u_password
  ) {
    loggedUser = {
      u_vessel: foundPreviousUser[0].vessel,
      u_last_name: foundPreviousUser[0].u_last_name,
      u_first_name: foundPreviousUser[0].u_first_name,
      u_cell: foundPreviousUser[0].u_cell,
      u_role: foundPreviousUser[0].u_role,
      u_whatsApp: foundPreviousUser[0].u_whatsApp,
    };

    if (loggedUser.u_role === "seafarer") {
      res.render("seafarer", { data: loggedUser });
    } else if (loggedUser.u_role === "driver") {
      res.render("driver", { data: loggedUser });
    } else if (loggedUser.u_role === "dispatcher") {
      res.render("dispatcher", { data: loggedUser });
    } else if (loggedUser.u_role === "admin") {
      res.render("admin", { data: loggedUser });
    }
  }
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT + "/home");
});
