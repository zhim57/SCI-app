// Import the ORM to create functions that will interact with the database.
var orm = require ("../config/orm");

var pickup = {
  read: function (req, cb) {
    orm.read(req.query.table, function (res) {
      cb(res);
    });
  },

  read4: function (req, cb) {
    orm.read4(req, function (res) {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: (cols, vals) => orm.create("sci_pickups", cols, vals),

  update: (objColVals, condition) =>
    orm.update("vessels", objColVals, condition, function (res) {
      cb(res);
    }),
  delete: (condition) =>
    orm.delete("vessels", condition, function (res) {
      cb(res);
    }),
};

// Export the database functions for the controller (catsController.js).
module.exports = pickup;
