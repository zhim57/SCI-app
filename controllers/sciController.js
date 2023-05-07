var request = require("request");
const https = require("https");
var express = require("express");
const mongoose = require ("mongoose");
const path = require("path");
var router = express.Router();
var axios = require("axios");
var currentUser;
var loggedUser;

// var DL_API_KEY = process.env.DL_API_KEY;
// console.log(DL_API_KEY);
var pickup = require("../models/pickup"); // to fix
var user = require("../models/user"); // to fix
const { text } = require("body-parser");
const { createBrotliCompress } = require("zlib");


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
