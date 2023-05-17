const dotenv = require("dotenv");
const mongoose = require("mongoose");

// const path = require("path");
dotenv.config({ path: "./.env" });
// var ClickSchema = new Schema({ ... });


const connectionOptions = {
  useNewUrlParser: true
};

mongoose.connect(
  process.env.MONGODB_URI || process.env.DATABASE_LOCAL, 
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

  Vessel
 };
