var db = require('../db');

module.exports = {
  get: function (params, callback) {
    var queryStr = "SELECT Users.name, Chores.id, Chores.name as chorename, Chores.category, Chores.completed, Chores.dueDate, Chores.houseId from Chores LEFT OUTER JOIN Users ON (Chores.UserId = Users.id) WHERE Chores.houseId=? and completed=0 ORDER BY Chores.dueDate";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  post: function (params, callback) {
    var queryStr="INSERT INTO Chores (userId, name, category, dueDate, houseId) VALUES(?,?,?,?,?)";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  put: function (params, callback) {
    //this currently assumes that put request will only update chore to be done
    var queryStr = "UPDATE Chores SET completed=1 WHERE id=?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    });
  },
  delete: function (params, callback) {
    var queryStr = "DELETE FROM Chores WHERE id=?";
    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    })
  }
}
