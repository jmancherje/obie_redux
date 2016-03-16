var db = require('../db');

module.exports = {
  getUsersInHouse: function (params, callback) {
    var queryStr="SELECT Users.name, Users.id, Users.email, Users.userImageUrl from Users WHERE houseId = ?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }, 
  findUserByVenmoId: function (params, callback) {
    var queryStr = "SELECT * FROM Users WHERE venmoid=?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  postUser: function (params, callback) {
    var queryStr = "INSERT INTO Users (name, venmoName, username, email, provider, venmo, balance, venmoid, userImageUrl ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },

  putUser: function (params, callback) {
    var queryStr = "UPDATE Users set balance = ?, venmo = ? WHERE venmoid = ?";
     db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  getHouseOfUser: function(params, callback) {
    var queryStr = "SELECT id, houseId, userImageUrl, isLandlord  FROM Users WHERE username = ? LIMIT 1";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  getUserImage: function(params, callback) {
    var queryStr = "SELECT userImageUrl, name, id FROM Users WHERE id=?";
    console.log('query params: ', params);
    db.query(queryStr, params, function(err, results) {
      console.log('getting user image and name: ', results);
      callback(err, results);
    });
  },
  getHouseIdwithUserId: function(params, callback) {
    var queryStr = "SELECT houseId from Users where id=?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }
}

