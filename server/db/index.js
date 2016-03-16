var mysql = require('mysql');
require('dotenv').load();

console.log("1 ", process.env.DBHOST,
"2  ",process.env.DBUSER,
"3 ",process.env.DBPASS,
"4 ", process.env.DATABASE );


// if (!process.env.deployCheck)


// if (!process.env.deployCheck){
//   var connection = mysql.createConnection({
//     user: "root",
//     password: "",
//     database: "bananas"
//   });
//   // var connection = mysql.createConnection({
//   //   host: process.env.DBHOST,
//   //   user: process.env.DBUSER,
//   //   password: process.env.DBPASS,
//   //   database: process.env.DATABASE 
//   // });
// } else {
  var connection = mysql.createConnection(process.env.JAWSDB_URL);
//}


connection.connect();

module.exports = connection;
