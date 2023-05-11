// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm");

var user = {
  read4: function (req, cb) {
    // console.log("req");
    // console.log(req);
    orm.read2(req, function (res) {
      cb(res);
      
    });
  },
  read1: function (req, cb) {
 
 
    orm.read1(req,  function (res) {
   
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: (cols, vals) => orm.create("sci_users", cols, vals, function (res) {
    cb(res);
  }),

  update: (objColVals, condition) => orm.update("vessels1", objColVals, condition, function (res) {
    cb(res);
  }),
  delete: condition => orm.delete("vessels1", condition, function (res) {
    cb(res);
  })
};

// Export the database functions for the controller (catsController.js).
module.exports = user;
