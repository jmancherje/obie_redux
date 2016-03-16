var db = require('../db');

module.exports = {
  postHouse: function(params, callback) {
    //set up query string to insert house entity in db
    var queryStr = 'INSERT INTO House (name, address, token) VALUES (?, ?, ?)';
    //make the query with the callback being passed in
    db.query(queryStr, params, function(err, results) {
      callback(err, results); 
    })
  },

  createHouse: function(params, callback) {
    //set up query string to insert house entity in db
    var queryStr = 'INSERT INTO House (name, address, token, landlordId) VALUES (?, ?, ?, ?)';
    //make the query with the callback being passed in
    db.query(queryStr, params, function(err, results) {
      callback(err, results); 
    })
  },

  getHouseIdByUserId: function(params, callback) {
    var queryStr = 'SELECT houseId from Users where id = ?';

    db.query(queryStr, params, function(err, results) {
      callback(err, results);
    })
  },

  getHouse: function(params, callback) {
    //need query string to find the house id with the provided
    //house token (assume when we update the schema we'll call
    //it token)
    var queryStr = 'SELECT id from House WHERE token = ?';
    db.query(queryStr, params, function(err, results) {
      callback(err, results); 
    });
  },

  updateHouseUserList: function(params, callback) {
    //queryString add the house id to the user with passed userId
    //not sure if this qstring is right, unsure if the question
    //marks will access the right thing, does order matter?
    var queryStr = 'UPDATE Users set houseId = ? WHERE id = ?';
    db.query(queryStr, params, function(err, results) {
      callback(err, results); 
    });
  },

  getHouseToken: function(params, callback) {
    var queryStr = 'SELECT token, name, address FROM House WHERE id = ?';
    db.query(queryStr, params, function(err, results) {
      callback(err, results); 
    });
  }
}