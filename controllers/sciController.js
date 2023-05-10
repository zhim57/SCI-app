const dotenv = require("dotenv");
var request = require("request");
const https = require("https");
var express = require("express");
// const mongoose = require ("mongoose");
const path = require("path");
var router = express.Router();
// var axios = require("axios");
// const session = require("express-session");
var router = express.Router();
const ejs = require("ejs");
const bodyParser = require("body-parser");
// const encrypt = require("mongoose-encryption");

var loggedUser;

// const { text } = require("body-parser");
const db = require('../db/db');

const User = db.User;
const Pickup = db.Pickup;
const Vessel = db.Vessel;
// const Countries = db.Countries;
// const response = await Countries.find({});
// var DL_API_KEY = process.env.DL_API_KEY;
 
// Create all our routes and set up logic within those routes where required.
router.get("/home", function (req, res) {
  res.render("home");
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/vessel_input", function (req, res) {
  res.render("vessel_input");
});

router.post("/register", async function (req, res) {
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
    res.render("login1", { data: data });
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
    res.render("login1", { data: data });
  }
});
router.post("/vessel_input", async function (req, res) {
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

router.post("/login", async function (req, res) {
  const u_email = req.body.u_email;
  const u_password = req.body.u_password;
  loggedUser = {
    u_email: req.body.u_email,
  };

  const foundPreviousUser = await User.find({ u_email: u_email });
  // console.log(foundPreviousUser);
  let full_name = foundPreviousUser[0].u_first_name + " "+ foundPreviousUser[0].u_last_name;

   var u_date="";
   var d = new Date();
   u_date += +(d.getMonth()+1)+"/"+d.getDate() + "/"+ d.getFullYear()


  if (
    foundPreviousUser[0].u_email === loggedUser.u_email &&
    foundPreviousUser[0].u_password === u_password



  ) {
    loggedUser = {
      u_email: foundPreviousUser[0].u_email,
      u_vessel: foundPreviousUser[0].u_vessel.replace( / /g,"_"),
      u_vessel_imo: foundPreviousUser[0].u_vessel_imo,
      u_last_name: foundPreviousUser[0].u_last_name,
      u_first_name: foundPreviousUser[0].u_first_name,
      u_cell: foundPreviousUser[0].u_cell,
      u_role: foundPreviousUser[0].u_role,
      u_whatsApp: foundPreviousUser[0].u_whatsApp,
      u_full_name : full_name.replace( / /g,"_"),
      u_date:u_date
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

router.post("/pickup", async function (req, res) {
  // console.log(req.body);
  const newPickup = new Pickup({

    crew_full_name: req.body.crew,
    crew_email: req.body.email,
    vessel: req.body.vessel,
    port_location:req.body.portselect,
    crew_whatsApp: req.body.whatsApp_number,
    pickUp: req.body.pickup_select,
    crew_cell: req.body.cell_number,
    dropOff: req.body.dropoff_select,
    numberPass: req.body.number_crew,
    remarks: req.body.remarks,
    dateJa: req.body.dateJa,
    timeJa: req.body.time_ja,
 });



  // const foundPreviousPickup = await User.find({ u_email: check });
  const foundPreviousPickUp = await Pickup.find({ timeJa: newPickup.timeJa });
  // console.log(foundPreviousPickUp);
 
  if ((foundPreviousPickUp[0] === undefined))  {
    
    const result1 = await newPickup.save();
    // console.log("result1");
    // console.log(result1);
    data = {
      remarks:
      "Hello " +
      result1.crew_full_name +
      ", thank you for Setting  your Pick Up!",
      
    };
    res.render("confirmation", { data: data });
  }
  else if ((foundPreviousPickUp[0].dateJa === newPickup.dateJa)  && (foundPreviousPickUp[0].timeJa === newPickup.timeJa) && (foundPreviousPickUp[0].pickUp === newPickup.pickUp)) {
    
    // console.log("foundPreviousPickUp");
    // console.log(foundPreviousPickUp);
    // console.log("newPickup");
    // console.log(newPickup);

    data = {
      remarks:
        "Hello " +
      newPickup.crew_full_name +
        ", pick up setting failed, there is already a pick up set for this pick up location, date and time!",
      
    };
    res.render( "confirmation", { data: data });
  } else   {

    const result1 = await newPickup.save();
    // console.log(result1);
    data = {
      remarks:
      "Hello " +
      result1.u_full_name +
      ", thank you for Setting  your Pick Up!",
      
    };
    res.render("confirmation", { data: data });


    
  }
});
// Export routes for server.js to use.
module.exports = router;
