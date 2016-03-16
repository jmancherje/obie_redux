var models = require('../models/paymentModel.js');
var jwt = require('jwt-simple');
var request = require('request');

module.exports = {
  getWhatYouOwe: function (req, res) {
    console.log('token in header ', req.headers.token);
    console.log('pre parsing: ', jwt.decode(req.headers.token, process.env.secret_code))
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    console.log('GET WHAT YOU OWE TOKEN: ', token);
    var params = [token.userid, token.userid];
    models.getWhatYouOwe(params, function(err, bills) {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json(bills);
      }
    });
  },

  getWhatIsOwedToYou: function (req, res) {
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    console.log('GET WHAT IS OWED TO YOU TOKEN: ', token);
    var params = [token.userid, token.userid];
    models.getWhatIsOwedToYou(params, function(err, paymentOwed) {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json(paymentOwed);
      }
    });
  },

  getWhatYouHavePaid: function (req, res) {
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    console.log('GET WHAT YOU HAVE PAID TOKEN: ', token);
    var params = [token.userid];
    models.getWhatYouHavePaid(params, function(err, paymentHistory) {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json(paymentHistory);
      }
    })
  },

  getWhatHasBeenPaidToYou: function (req, res) {
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    var token = jwt.decode(req.headers.token, process.env.secret_code);

    console.log('GET WHAT HAS BEEN PAID TO YOU TOKEN: ', token);
    var params = [token.userid];
    models.getWhatHasBeenPaidToYou(params, function(err, paymentHistory) {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json(paymentHistory);
      }
    })
  },

  postPayment: function (req, res) {
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    console.log('POST PAYMENT TOKEN: ', token);
    var params = [req.body.billId, req.body.userId, req.body.amount];
    models.postPayment(params, function(err, payment) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(payment.insertId);
      }
    });
  },

  postBill: function (req, res) {
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    console.log('POST BILL TOKEN: ', token);
    var params = [token.userid, req.body.total, req.body.name, req.body.dueDate];
    models.postBill(params, function(err, payment) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(payment.insertId);
      }

    });
  },

  markPaymentAsPaid: function (req, res) {
    var params = [req.params.paymentId];
    models.markPaymentAsPaid(params, function (err, payment) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(payment);
      }
    });
  },
  makeVenmoPayment: function(req, res) {
    //using the request library with a callback
    // var token = JSON.parse(jwt.decode(req.headers.token, process.env.secret_code));
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    console.log('MAKE VENMO PAYMENT TOKEN: ', token);
    var obj = {}
    obj.access_token = token.access_token;
    obj.email = req.body.email;
    obj.amount = req.body.amount;
    obj.note = req.body.note;
    obj.audience = 'public';
    console.log(obj);

    request.post('https://api.venmo.com/v1/payments', {form: obj}, function(e, r, venmo_receipt){
        res.json(venmo_receipt);
    });
  }, 

  getPaymentsByHouseId: function(req, res) {
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    var params = [token.userid, req.params.houseId];
    console.log('get payments by house id for house specific payments, userId  + houseid:', params);
    models.getPaymentsByHouseId(params, function (err, payment) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(payment);
      }
    });
  }

}
