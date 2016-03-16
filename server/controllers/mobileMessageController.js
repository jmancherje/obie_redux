var messageModel = require('../models/messageModel.js');
var paymentModel = require('../models/paymentModel.js');
var userModel = require('../models/userModel.js')

module.exports = {
  get: function(req, res){
    var params = [req.params.houseId];
    messageModel.get(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  }, 

  post: function(req, res) {
    var params = [req.body.userId, req.body.text, req.body.houseId];
    messageModel.post(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      console.log('POST MESS', results);
      res.json(results);
    });
  },

  getBills: function(req, res) {
    var params = [req.params.userId, req.params.userId]
    paymentModel.getWhatYouOwe(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  },

  getPayments: function(req, res) {
    var params = [req.params.userId, req.params.userId]
    paymentModel.getWhatIsOwedToYou(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  },

  getUsers: function(req, res) {
    console.log(req)
    var params = [req.params.houseId];
    userModel.getUsersInHouse(params, function(err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.json(results);
    });
  },

  postBill: function(req, res) {
    var params = [req.body.userid, req.body.total, req.body.name, req.body.dueDate];
    paymentModel.postBill(params, function(err, payment) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(payment.insertId);
      }
    });
  }
}



