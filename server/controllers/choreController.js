var choreModel = require('../models/choreModel.js');
var jwt = require('jwt-simple');

module.exports = {
  get: function (req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('GET CHORES TOKEN: ', token);
    var params = [token.houseId];
    choreModel.get(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  },

  post: function (req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('POST CHORES TOKEN: ', token);   
    var params = [req.body.userId, req.body.name, req.body.category, req.body.dueDate, token.houseId];
    choreModel.post(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.status(201).json(results.insertId);
    }); 
  },

  put: function (req, res) {
    var params = [req.params.choreId];
    choreModel.put(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.status(200).json(results);
    });
  },
  
  delete: function (req, res) {
    var params = [req.params.choreId];
    choreModel.delete(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  }
}
