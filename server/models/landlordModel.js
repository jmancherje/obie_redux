var db = require('../db');

module.exports = {
  getHousesOwned: function(params, callback) {
    var queryStr = "SELECT House.name, House.id, House.address, House.token FROM House WHERE landlordId=?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  addProperty: function(params, callback) {
    var queryStr = "UPDATE House SET landlordId = ? WHERE token = ?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },

  getLandlordPropertyOnLogin: function(params, callback) {
    var queryStr = "SELECT houseId, House.name, House.address from Users LEFT OUTER JOIN House ON (House.id = Users.houseId) where Users.id = ?"
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },

  giveLandlordDummyHouseID: function(params, callback) {
    var queryStr = 'UPDATE Users set houseId=1, isLandlord=1 WHERE id= ?';
    db.query(queryStr, params, function(err, results) {
      callback(err, results); 
    });
  }
}