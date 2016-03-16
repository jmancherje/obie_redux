var userController = require('../controllers/userController.js');
var jwt = require('jwt-simple');

var isLoggedIn = function(req) {
  //return req.session ? !!req.session.jwt : false;
  return req.session && req.session.jwt;
};


module.exports = {
  checkUser: function(req, res, next){
    if (!isLoggedIn(req)) {
      res.redirect('/login');
    } else {
      next();
    }
  },

  decodeJwt: function(req, res, next) {
    if (!req.headers.token) {
      res.send('login');
    } else {
      var token = jwt.decode(req.headers.token, process.env.secret_code);
      req.user = token;
      next();
    }
  },

  rootDecodeJwt: function(req, res, next) {
    if (!req.headers.token) {
      res.send('login');
    } else {
      var token = jwt.decode(req.headers.token, process.env.secret_code);
      req.user = token;
      next();
    }
  },

  // make sure user has a valid token with a userId
  isLoggedInUser: function(req, res, next) {
    var token = jwt.decode(req.headers.token, process.env.secret_code);
    // store in token if they're landlord
    // or change this to query for their status
    // check if req is an ajax request, send a status code instead
    if (token.userid && token.houseId) {
      // if (is landlord)
        // redirect to /landlord
      next();
    } else if (token.userid) {
      res.redirect('/registration')
    } else {
      res.redirect('/login')
    }
  },


  // middleware to '/'
  authToTenant: function(req, res, next) {
    if (!req.user.userId) {
      res.redirect('/login');
    } else if (!req.user.houseId) {
      res.redirect('/registration');
    } else if (req.user.isLandlord) {
      res.redirect('/landlord');
    } else if (!req.user.isLandlord) {
      next();
    }
  },

  // middleware for /landlord
  authToLandlord: function(req, res, next) {
    if (!req.user.userId) {
      res.redirect('/login');
    } else if (!req.user.houseId) {
      res.redirect('/registration');
    } else if (!req.user.isLandlord) {
      res.redirect('/');
    } else if (req.user.isLandlord) {
      next();
    }
  }
};
