// Set up MySQL connection.
var mysql = require("mysql");

var connection ;
if ( typeof process.env.JAWSDB_URL !== "undefined") {
connection = mysql.createConnection( process.env.JAWSDB_URL)
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password1",
    database: "burger_db"
  });
}
// Make connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Export connection for our ORM to use.
module.exports = connection;
