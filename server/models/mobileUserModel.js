var db = require('../db');

module.exports ={
  getUserHouseIdWithEmail: function(params, callback){
    var queryStr  = "SELECT id, HouseId from Users where email = ?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },

  getUsersInHouse: function (params, callback) {
    var queryStr="SELECT Users.name, Users.id, Users.email, Users.userImageUrl from Users WHERE houseId = ?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }
}
