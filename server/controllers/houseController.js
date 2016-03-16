var houseModel = require('../models/houseModel');
var jwt = require('jwt-simple');

var idGenerator = function () {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for( var i=0; i < 11; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = {
  postHouse: function(req, res) {
    //extract house name from req.body
    var name = req.body.name;
    var address = req.body.address;
    var code = idGenerator();
    //insert that name into params
    // var address = req.body.address || null;
    // var userId = token.userid;
    var params = [name, address, code];
    houseModel.postHouse(params, function(err, results) {
      if(err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  createHouse: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    var code = idGenerator();
    console.log('CREATE HOUSE TOKEN: ', token);
    //extract house name from req.body
    var name = req.body.name
    //insert that name into params
    var address = req.body.address || null;
    var userId = token.userid;
    var params = [name, address, code, userId];
    houseModel.createHouse(params, function(err, results) {
      if(err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  getHousebyHouseId: function(req, res) {
    //set params to equal the token from the params
    var params = [req.params.token];
    houseModel.getHouse(params, function(err, results) {
      if(err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  },

  updateUserHouseId: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('UPDATE USER HOUSEID TOKEN: ', token);
    var houseId = req.body.houseId;
    var userId = token.userid;
    var params = [houseId, userId];
    console.log("PARAMS", params);
    houseModel.updateHouseUserList(params, function(err, results) {
      if(err) {
        res.sendStatus(500);
      } else {
        // res.redirect('/')
        res.json(results)
      }
    })
  },
  getHouseToken: function(req, res) {
    var params = [req.params.houseId];
    houseModel.getHouseToken(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  },
  getHouseCode: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('GET HOUSE CODE TOKEN: ', token); 
    var params = [token.houseId];
    console.log(params);
    houseModel.getHouseToken(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    })
  }
}