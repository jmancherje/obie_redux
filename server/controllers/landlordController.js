var landlordModel = require('../models/landlordModel');
var jwt = require('jwt-simple');

module.exports = {
  getHousesOwned: function (req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code)); 
    console.log('GET HOUSES OWNED TOKEN: ', token);
    var params = [token.userid];
    landlordModel.getHousesOwned(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  getLandlordPropertyOnLogin: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code)); 
    var params = [token.userid];
    landlordModel.getLandlordPropertyOnLogin(params, function (err, results) {
      if (err) {
        console.log('error getting landlord property on login', err);
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  updateLandlordsCurrentHouse: function(req, res) {
    var houseId = req.params.houseId;
    var obie = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('UPDATE LANDLORDS CURRENT HOUSE TOKEN: ', obie);
    obie.houseId = +houseId;
    console.log('updated token with different houseId: ', obie);
    console.log("houseId should be number: ", typeof obie.houseId);
    var token = jwt.encode(obie, process.env.secret_code)
    var response = {
      token: token,
      houseId: houseId
    };
    res.send(response);
  },

  addProperty: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('ADD PROPERTY TOKEN: ', token);
    var params = [token.userid, req.params.houseToken];
    landlordModel.addProperty(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results);
      }
    });
  },

  giveLandlordDummyHouseID: function(req, res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    console.log('GIVE LANDLORD DUMMY HOUSE ID TOKEN: ', token);
    var params = [token.userid];
    landlordModel.giveLandlordDummyHouseID(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(results)
      }
    });
  },

  updateLandlordsToken: function(req,res) {
    var token = (jwt.decode(req.headers.token, process.env.secret_code));
    token.isLandlord = 1;
    var encodedToken = (jwt.encode(token, process.env.secret_code));
    res.json(encodedToken);
  }
}



