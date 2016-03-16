var db = require('../db');

module.exports = {
  get: function (params, callback) {
    var queryStr = "SELECT Users.name, Chores.id, Chores.name as chorename, chores.category, Chores.completed from Chores LEFT ";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }

  // post: function(){
  //   var queryStr = "";
  //   db.query(queryStr, params, function(err, results) {
  //     callback(err, results);
  //   });
  // },

  // delete: function(){
  //   var queryStr = "";
  //   db.query(queryStr, params, function(err, results) {
  //     callback(err, results);
  //   })
  // }
}
