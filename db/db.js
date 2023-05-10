const config = require("../config/config.json");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.connect(
  process.env.MONGODB_URI || config.connectionString,
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

// Add any other plugins or middleware here. For example, middleware for hashing passwords
var secret = process.env.SECRET;
vesselSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["v_email"],
});

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
  u_code: String,
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  outWard: { type: Boolean, default: false },
  inWard: { type: Boolean, default: false },
});

// Add any other plugins or middleware here. For example, middleware for hashing passwords
var secret = process.env.SECRET;
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["u_email"]
});

const User = new mongoose.model("User", userSchema);

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
  Vessel,
  // Countries: require('./models/countries.model'),
};
