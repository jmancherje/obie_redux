var userModel = require('../models/userModel.js');
var jwt = require('jwt-simple');

module.exports = {
  getUsersInHouse: function (req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('GET USERS IN HOUSE TOKEN: ', token);
    var params = [token.houseId];
    userModel.getUsersInHouse(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  findUserByVenmoId: function (req, res) {
    var params = [req.params.venmoId];
    userModel.findUserByVenmoId(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  },
  postUser: function (req, res) {
    var name = req.body.name
    var venmoName = req.body.venmoName;
    var username = req.body.username;
    var email = req.body.email;
    var provider = req.body.provider;
    var venmo = req.body.venmo;
    var balance = parseFloat(req.body.balance);
    var venmoid = req.body.venmoid;
    var userImageUrl = req.body.userImageUrl;
    var params = [name, venmoName, username, email, provider, venmo, balance, venmoid, userImageUrl];
    userModel.postUser(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results.insertId);
      }
    })
  },
  putUser: function (req, res) {
    var params = [req.body.balance, req.body.venmo, req.body.venmoid];
    userModel.putUser(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  },
  getHouseOfUser: function(req, res) {
    var params = [req.params.username];
    userModel.getHouseOfUser(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  },
  getUserImage: function(req, res) {
    console.log('get user image: ', req.headers.token);
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('GET USER IMAGE TOKEN: ', token);
    var params = [token.userid];
    userModel.getUserImage(params, function(err, results) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })

  },
  leaveHouse: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('LEAVE HOUSE TOKEN: ', token);
    var params = [token.userid];
    userModel.leaveHouse(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  },
  getHouseIdwithUserId: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    params = [token.userid];
    userModel.getHouseIdwithUserId(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  }
}
