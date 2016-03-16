var db = require('../db');

module.exports = {
  get: function (params, callback) {
    var queryStr = "SELECT Users.name, Users.userImageUrl, Messages.text, DATE_FORMAT(Messages.time,'%W, %M %e, %Y %h:%i %p') AS time FROM Messages LEFT OUTER JOIN Users ON (Messages.userid=Users.id) WHERE Messages.houseId=? AND landlordChat=0 ORDER BY Messages.time DESC LIMIT 50";
    db.query(queryStr, params, function (err, results) {
      callback(err, results);
    });
  },

  post: function (params, callback) {
    var queryStr = "INSERT INTO Messages (userId, text, houseId, time) VALUES (?,?,?, NOW())";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },

  getLandlordChat: function (params, callback) {
    var queryStr = "SELECT Users.name, Users.userImageUrl, Users.isLandlord, Messages.text, DATE_FORMAT(Messages.time,'%W, %M %e, %Y %h:%i %p') AS time FROM Messages LEFT OUTER JOIN Users ON (Messages.userid=Users.id) WHERE Messages.houseId=? AND landlordChat=1 ORDER BY Messages.time DESC LIMIT 50";
    db.query(queryStr, params, function (err, results) {
      callback(err, results);
    });
  },

  postToLandlordChat: function (params, callback) {
    var queryStr = "INSERT INTO Messages (userId, text, houseId, time, landlordChat) VALUES (?,?,?, NOW(),1)";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  }
}