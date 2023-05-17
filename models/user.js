// importing modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require('mongoose-findorcreate')
// var passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
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
   completed: { type: Boolean, default: false },
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
  

// export userschema
module.exports = User;
