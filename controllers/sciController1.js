var request = require("request");
const https = require("https");
var express = require("express");
const path = require("path");
var router = express.Router();
var axios = require("axios");
var currentUser;
var loggedUser;
// import {currentUser } from "../public/assets/js/app.js";
// var DL_API_KEY = process.env.DL_API_KEY;
// console.log(DL_API_KEY);

var pickup = require("../models/pickup"); // to fix
var user = require("../models/user"); // to fix
const { text } = require("body-parser");
const { createBrotliCompress } = require("zlib");

// Create all our routes and set up logic within those routes where required.

router.get("/api/users/", function (req, res) {
  //to fix
  user.read1(req.query, function (data) {
    res.send(data);
  });
});

router.get("/home", function (req, res) {
  res.render("home");
});
router.get("/login", function (req, res) {
  res.render("login");
});
router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register1", function (req, res) {});

//create a question
router.post("/register", function (req, res) {
  var cols = Object.entries(req.body).map((e) => e[0]);
  var vals = Object.entries(req.body).map((e) => e[1]);

  currentUser = {
    u_email: req.body.u_email,

    u_vessel: req.body.u_vessel,
    u_last_name: req.body.u_last_name,
    u_first_name: req.body.u_first_name,
    u_cell: req.body.u_cell,
    u_role: req.body.u_role,
    u_whatsApp: req.body.u_whatsApp,
  };

  console.log(currentUser);
  user
    .create(cols, vals)
    .then((results) => {
      // res.json({ id: results.insertId });
      res.render("seafarer", currentUser);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", function (req, res) {
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

if(loggedUser.u_role === "seafarer"){

  res.render("seafarer");
}
else if (loggedUser.u_role === "driver"){

  res.render("driver");

}

else if (loggedUser.u_role === "dispatcher"){

  res.render("dispatcher");

}
else if (loggedUser.u_role === "admin"){

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

//create vessel
router.post("/api/sci_pickups", function (req, res) {
  var cols = Object.entries(req.body).map((e) => e[0]);
  var vals = Object.entries(req.body).map((e) => e[1]);
  pickup
    .create(cols, vals)
    .then((results) => {
      res.json({ id: results.insertId });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("request passed step2");
});
//create user
router.post("/api/sci_users", function (req, res) {
  var cols = Object.entries(req.body).map((e) => e[0]);
  var vals = Object.entries(req.body).map((e) => e[1]);
  user
    .create(cols, vals)
    .then((results) => {
      res.json({ id: results.insertId });
    })
    .catch((err) => {
      console.log(err);
    });
});

//change question
router.put("/api/questions/:id", function (req, res) {
  var condition = "id = " + req.params.id;
  question
    // info to be updated..
    .update(
      {
        ex_name: req.body.exName,
      },
      condition
    )
    .then((result) => {
      if (result.changedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        // console.log("vessel email address updated ");
        res.status(200).end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//delete question
router.delete("/api/questions/:id", function (req, res) {
  var condition = "id = " + req.params.id;
  question
    .delete(condition)
    .then((result) => {
      if (result.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//delete user
router.delete("/api/users/:id", function (req, res) {
  var condition = "id = " + req.params.id;
  user
    .delete(condition)
    .then((result) => {
      if (result.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", function (req, res) {
  res.render("index", hbsObject8);
});

router.get("/api/questions01/", function (req, res) {
  // console.log("one question by id req.query:");
  // console.log(req.query);

  question.read4(req.query, function (data) {
    if (data === undefined) {
      console.log("no question with this id found in the db!");
    } else {
      res.send(data); // Cannot set headers after they are sent to the client
    }
  });
});
router.get("/api/questions02/", function (req, res) {
  // console.log("one question by id req.query:");
  // console.log(req.query);

  var data = JSON.stringify({
    messages: [
      {
        channel: "sms",
        recipients: ["+19084720799", "+19084720799"],
        content: "Greetings from D7 API",
        msg_type: "text",
        data_coding: "text",
      },
    ],
    message_globals: {
      originator: "SignOTP",
      report_url: "https://the_url_to_recieve_delivery_report.com",
    },
  });

  var config = {
    method: "post",
    url: "https://api.d7networks.com/messages/v1/send",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiNGQzNmFmMTEtZDM2NS00NmNhLTlkYmItN2ZhZGZjOGRmYjFhIn0.nAnOW72ueBse_R-BRvpdfOvusnqcYCmKJnjtSxfqAoo",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

// Export routes for server.js to use.
module.exports = router;
