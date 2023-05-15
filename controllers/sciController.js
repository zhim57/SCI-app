const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
// const bodyParser = require("body-parser");
var md5 = require("md5");
const session = require("express-session");
var passport = require("passport");
var loggedUser;
// const path = require("path");
dotenv.config({ path: "./.env" });
const db = require("../db/db");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const User = db.User;
// const User = ("./models/user.js")
const LocalStrategy = require("passport-local").Strategy;
// passport.use(new LocalStrategy(User.authenticate()));

secretkey = process.env.SECRET;
router.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(async function (id, done) {
  let user = User.findById(id).then((user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: "http://localhost:8082/auth/google/home1",
      callbackURL: "https://sci-transport.herokuapp.com/auth/google/home1",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

const Pickup = db.Pickup;
const Vessel = db.Vessel;

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
  res.render("home");
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/logout", function (req, res) {
  req.logout(req, function(cb){
console.log("logged out");
console.log(req);
  })
  res.redirect("/");
});
router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/vessel_input", function (req, res) {
  res.render("vessel_input");
});
router.get("/crew_pickups", function (req, res) {
  console.log(req.user);
  let userId = req.user.googleId;
  console.log("userId");
  console.log(userId);
  console.log(userId);
  res.render("crew_pickups", {data: userId});
});
router.get("/seafarer", function (req, res) {
  if (req.isAuthenticated()) {
    let data = 1; //needto insert users data here

    // let data = JSON.parse(req.query.valid);
    res.render("seafarer", { data: data });
  } else {
    res.redirect("/login");
  }
});
router.get("/driver", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("driver");
  } else {
    console.log("something is wrong ");
    // res.redirect("/login");
  }
});
router.get("/home1", async function (req, res) {

  let user= await User.findById(req.user.id);
console.log(user);

let data = user

  res.render("profile_update",{data:data});
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/auth/google/home1",
  passport.authenticate("google", { failureredirect: "/login" }),
  function (req, res) {
    console.log("authenticated1");
    res.redirect("/home1");
  }
);
router.post("/register", function (req, res) {
  let full_name = req.body.u_first_name + " " + req.body.u_last_name;

  var u_date = "";
  var d = new Date();
  u_date += +(d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();

  const newUser = {
    username: req.body.u_email,
    u_full_name: full_name.replace(/ /g, "_"),
    u_date: u_date,
    u_vessel: req.body.u_vessel.replace(/ /g, "_"),
    u_vessel_imo: req.body.u_vessel_imo,
    u_last_name: req.body.u_last_name,
    u_first_name: req.body.u_first_name,
    u_cell: req.body.u_cell,
    u_role: req.body.u_role,
    u_whatsApp: req.body.u_whatsApp,
    u_code: md5(req.body.u_code),
  };

  User.register(
    new User({
      u_full_name: full_name.replace(/ /g, "_"),
      u_date: u_date,
      u_vessel: req.body.u_vessel.replace(/ /g, "_"),
      u_vessel_imo: req.body.u_vessel_imo,
      u_last_name: req.body.u_last_name,
      u_first_name: req.body.u_first_name,
      u_cell: req.body.u_cell,
      u_role: req.body.u_role,
      u_whatsApp: req.body.u_whatsApp,
      u_code: md5(req.body.u_code),
      username: req.body.u_email,
    }),
    req.body.u_password,
    function (err, user) {
      if (err) {
        res.json({
          success: false,
          message: "Your account could not be saved. Error: " + err,
        });
      } else {
        req.login(user, (er) => {
          if (er) {
            // res.json({ success: false, message: er });
            res.redirect("/register");
          } else {
            data = { remarks: "these are the remarks" };
            // res.json({ success: true, message: "Your account has been saved" });
            var string = encodeURIComponent(JSON.stringify(newUser));
            res.redirect("/seafarer?valid=" + string);

            //  , {data:data}
          }
        });
      }
    }
  );
});
router.post("/update_profile", async function (req, res) {
  let full_name = req.body.u_first_name + " " + req.body.u_last_name;

  var u_date = "";
  var d = new Date();
  u_date += +(d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
var id = req.user.id;
console.log (id);
  const updateUser = {
    username: req.body.u_email,
    u_full_name: full_name.replace(/ /g, "_"),
    u_date: u_date,
    u_vessel: req.body.u_vessel.replace(/ /g, "_"),
    u_vessel_imo: req.body.u_vessel_imo,
    u_last_name: req.body.u_last_name,
    u_first_name: req.body.u_first_name,
    u_cell: req.body.u_cell,
    u_rank: req.body.u_rank.replace(/ /g, "_"),
    u_role: req.body.u_role,
    u_whatsApp: req.body.u_whatsApp,
    u_code: req.body.u_code,
  };



  const filter = {_id: id };
const update = updateUser;

// `doc` is the document _before_ `update` was applied
let doc = await User.findOneAndUpdate(filter, update,{
  new: true});

  let loggedUser ={


    u_cell: doc.u_cell,
    u_code: doc.u_code,
    u_first_name: doc.u_first_name,
    u_full_name: doc.u_full_name,
    u_last_name: doc.u_last_name,
    u_rank: doc.u_rank,
    u_role: doc.u_role,
    u_vessel: doc.u_vessel,
    u_vessel_imo: doc.u_vessel_imo,
    u_whatsApp: doc.u_whatsApp,
    username: doc.username



  }

  if (loggedUser.u_role === "seafarer") {
    res.render("crew_pickups", { data: loggedUser });
  } else if (loggedUser.u_role === "driver") {
    res.render("driver", { data: loggedUser });
  } else if (loggedUser.u_role === "dispatcher") {
    res.render("dispatcher", { data: loggedUser });
  } else if (loggedUser.u_role === "admin") {
    res.render("admin", { data: loggedUser });
  }
 

  
});

//   User.register(
//     { username: req.body.u_email },
//     req.body.u_password,
//     function (err, user) {
//       if (err) {
//         console.log(err);
//         res.redirect("/register");
//         // , { data: newUser}
//       } else {
//         passport.authenticate("local")(req, res, function () {
//           console.log("success1");
//           console.log(user);
//           res.redirect("/seafarer");
//         });

//         console.log("user");
//         console.log(user);
//       }
//     }
//   );
// });

// // console.log(req.body);
// const check = req.body.u_email;
// const v_imo = req.body.u_vessel_imo;

// const foundPreviousUser = await User.find({ u_email: check });
// const foundVessel = await Vessel.find({ v_imo: v_imo });

// if (
//   foundPreviousUser[0] === undefined &&
//   foundVessel[0].v_code === newUser.u_code
// ) {
//   const result1 = await newUser.save();

//   data = {
//     remarks:
//       "Hello " +
//       result1.u_first_name +
//       ", thank you for registering , please log in!",
//     u_email: check,
//     u_first_name: newUser.u_first_name,
//   };
//   res.render("login1", { data: data });
// } else if (
//   foundPreviousUser[0] === undefined &&
//   foundVessel[0].v_code != newUser.u_code
// ) {
//   data = {
//     remarks:
//       "Hello " +
//       newUser.u_first_name +
//       ", registration failed, wrong verification code!",
//     u_email: check,
//     u_first_name: newUser.u_first_name,
//   };
//   res.render("confirmation", { data: data });
// } else if (foundPreviousUser[0].u_email === check) {
//   data = {
//     remarks:
//       "Hello " +
//       foundPreviousUser[0].u_first_name +
//       ",  your email is already on file , please log in!",
//     u_email: check,
//     u_first_name: foundPreviousUser[0].u_first_name,
//   };
//   res.render("login1", { data: data });
// }

router.post("/vessel_input", async function (req, res) {
  // console.log(req.body);
  const v_name = req.body.v_name;
  const v_imo = req.body.v_imo;
  const v_code = req.body.v_code;
  const newVessel = new Vessel({
    v_name: req.body.v_name,
    v_imo: req.body.v_imo,
    v_email: req.body.v_email,
    v_code: md5(req.body.v_code),
  });
  const foundVessel = await Vessel.find({ v_imo: v_imo });

  console.log(foundVessel);

  if (foundVessel[0] === undefined) {
    const result1 = await newVessel.save();
    console.log(result1);
    data = {
      remarks:
        "Hello , vessel name :" +
        result1.v_name +
        "vessel imo: " +
        result1.v_imo +
        " ver code :   " +
        result1.v_code +
        ", thank you for registering this vessel!",
    };
    res.render("confirmation", { data: data });
  } else if (foundVessel[0].v_imo === v_imo) {
    data = {
      remarks:
        "Hello " +
        foundVessel[0].v_imo +
        ",  this imo  is already in database, we ve sent the verification code to the ship's email on record!",
      v_imo: foundVessel[0].v_imo,
      v_name: foundVessel[0].v_name,
    };
    res.render("confirmation", { data: data });
  }
});

router.post("/crew-pickups", async function (req, res) {
  // console.log(req.body);
  // console.log("pick ups pressed");
  const foundPickups = await Pickup.find({ crew_email: req.body.crew1 });
  if (foundPickups[0] != undefined) {
    console.log(foundPickups);
    res.json(foundPickups);
  }
});

router.post("/login", function (req, res) {
  let username = req.body.username;
  const user = new User({
    username: req.body.username,
    password: req.body.upassword,
  });
  req.login(user, function (err) {
    if (err) {
      res.json({
        success: false,
        message: "Your account could not be logged in . Error: " + err,
      });
    } else {
      passport.authenticate("local", async function (err, user, info) {
        if (err) {
          console.log(user);
          res.json({ success: false, message: err + "!1! " });
        } else {
          if (!user) {
            res.json({
              success: false,
              message: "username or password incorrect",
            });
          } else {
            const token = jwt.sign(
              { userId: user._id, username: user.username },
              secretkey,
              { expiresIn: "24h" }
            );
            // res.json({ success: true, message: "Authentication successful", token: token });
          }
        }

        const foundPreviousUser = await User.find({ username: username });
        if (foundPreviousUser[0] != undefined) {
          // console.log("user found");
          // console.log(foundPreviousUser);

          var u_date = "";
          var d = new Date();
          u_date +=
            +(d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
          loggedUser = {
            username: foundPreviousUser[0].username,
            u_vessel: foundPreviousUser[0].u_vessel.replace(/ /g, "_"),
            u_vessel_imo: foundPreviousUser[0].u_vessel_imo,
            u_last_name: foundPreviousUser[0].u_last_name,
            u_first_name: foundPreviousUser[0].u_first_name,
            u_cell: foundPreviousUser[0].u_cell,
            u_role: foundPreviousUser[0].u_role,
            u_whatsApp: foundPreviousUser[0].u_whatsApp,
            u_full_name: foundPreviousUser[0].u_full_name,
            u_date: u_date,
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
        } else {
          console.log("error user not found");
        }
      })(req, res);
    }
  });

  // loggedUser = {
  //   u_email: req.body.u_email,
  // };

  function hide() {
    if (result === true) {
    } else if (
      foundPreviousUser[0].u_email === loggedUser.u_email &&
      foundPreviousUser[0].u_password != u_password
    ) {
      console.log("sorry, wrong password entered...");
    }
    // } else if (foundPreviousUser[0] === undefined) {
    //   console.log("no such user , please register first");
    //   res.render("register");
  }
});

router.post("/pickup", async function (req, res) {
  // console.log(req.body);
  const newPickup = new Pickup({
    crew_full_name: req.body.crew,
    crew_email: req.body.email,
    vessel: req.body.vessel,
    port_location: req.body.portselect,
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

  if (foundPreviousPickUp[0] === undefined) {
    const result1 = await newPickup.save();
    // console.log (result1);
    data = {
      remarks:
        "Hello " +
        result1.crew_full_name +
        ", thank you for Setting  your Pick Up!",
      pickup: result1,
    };
    res.render("confirmation", { data: data });
  } else if (
    foundPreviousPickUp[0].dateJa === newPickup.dateJa &&
    foundPreviousPickUp[0].timeJa === newPickup.timeJa &&
    foundPreviousPickUp[0].pickUp === newPickup.pickUp
  ) {
    data = {
      remarks:
        "Hello " +
        newPickup.crew_full_name +
        ", pick up setting failed, there is already a pick up set for this pick up location, date and time!",
    };
    res.render("confirmation", { data: data });
  } else {
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
