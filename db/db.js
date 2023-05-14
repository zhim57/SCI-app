const dotenv = require("dotenv");
const config = require("../config/config.json");
const mongoose = require("mongoose");
var passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const path = require("path");
dotenv.config({ path: "./.env" });
var findOrCreate = require('mongoose-findorcreate')
// var ClickSchema = new Schema({ ... });


const connectionOptions = {
  useNewUrlParser: true
};

mongoose.connect(
  process.env.MONGODB_URI, //|| config.connectionString,
  connectionOptions
);
mongoose.Promise = global.Promise;

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


const Vessel = new mongoose.model("Vessel", vesselSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  googleId :String,
  u_full_name: String,
  u_rank:String,
  u_vessel: String,
  u_vessel_imo: String,
  u_last_name:String,
  u_first_name: String,
  u_cell: String,
  u_role: String,
  u_whatsApp: String,
  u_code: {type: String},
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
 verified: { type: Boolean, default: false },
  outWard: { type: Boolean, default: false },
  inWard: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose);
// Add any other plugins or middleware here. For example, middleware for hashing passwords
userSchema.plugin(findOrCreate);
// var Click = mongoose.model('Click', ClickSchema);


const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// const LocalStrategy = require("passport-local").Strategy;
// passport.use(new LocalStrategy(User.authenticate()));


const pickupSchema = new mongoose.Schema({
  crew_full_name: String,
  vessel: String,
  crew_email: String,
  port_location: String,
  crew_whatsApp: String,
  pickUp: String,
  crew_cell: String,
  dropOff: String,
  numberPass: Number,
  remarks: String,
  lastMessageTo: String,
  lastMessageFrom: String,
  verificationCode: String,
  driver: String,
  vehicle: String,
  vehicle_cell: String,
  dispatcher: String,
  driverReview: String,
  passengerReview: String,
  driverScore: String,
  passengerScore: String,
  dateJa: String,
  timeJa: String,
  active: { type: Boolean, default: true },
  cancelled: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
});

const Pickup = new mongoose.model("Pickup", pickupSchema);

module.exports = {
  Pickup,
  User,
  Vessel
 };
