var messageController = require('../controllers/messageController.js')
var paymentController = require('../controllers/paymentController.js');
var choreController = require('../controllers/choreController.js');
var userController = require('../controllers/userController.js');
var houseController = require('../controllers/houseController.js');
var tokenController = require('../controllers/tokenController.js');
var landlordController = require('../controllers/landlordController.js');
var mobileMessageController = require('../controllers/mobileMessageController.js')
var mobileChoreController = require('../controllers/mobileChoreController.js')
var mobileUserController = require('../controllers/mobileUserController.js')
var Auth = require('../auth/Auth.js');
var passport = require('passport');
var session = require('express-session');
var jwt = require('jwt-simple');
var request = require('request');



module.exports = function(app, express) {

  //mobile user

  app.post('/api/mobile/messages', mobileMessageController.post);
  app.get('/api/mobile/users/:email', mobileUserController.getUserHouseIdWithEmail);
  app.get('/api/mobile/users/:houseId', mobileUserController.getUsersInHouse);
  app.get('/api/mobile/messages/:houseId', mobileMessageController.get);

  app.get('/api/mobile/bills/:userId', mobileMessageController.getBills)
  app.get('/api/mobile/payments/:userId', mobileMessageController.getPayments)
  app.get('/api/mobile/users/:houseId', mobileMessageController.getUsers)

  app.get('/api/mobile/chores/:houseId', mobileChoreController.get);

  // //mobile chores
  // app.get('/api/mobile/chores', mobileChoreController.get);
  // app.post('/api/mobile/chores', mobileChoreController.post);
  // app.put('/api/mobile/chores/:choreId', mobileChoreController.put);
  // app.delete('/api/mobile/chores/:choreId', mobileChoreController.delete);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true
  }));

  app.get('/auth/venmo', passport.authenticate('venmo', {
      session: false,
      scope: ['make_payments', 'access_feed', 'access_profile', 'access_email', 'access_phone', 'access_balance', 'access_friends'],
      failureRedirect: '/login'
  }), function(req, res) {
    res.render("hi");
  });

  //Passport
  app.get('/auth/venmo/callback', passport.authenticate('venmo', {
      failureRedirect: '/login' //redirect to login eventually
  }), function(req, res) {
    return req.session.regenerate(function() {
      var token = jwt.decode(req.user, process.env.secret_code);
      req.session.jwt = req.user;
      res.redirect('/saveToken')
    });
  });

  //Users
  app.get('/users/', userController.getUsersInHouse);
  app.get('/users/venmo/:venmoId', userController.findUserByVenmoId);
  app.get('/users/id/:username', userController.getHouseOfUser);
  app.post('/users', userController.postUser);
  app.put('/users', userController.putUser);
  app.get('/users/images', userController.getUserImage);
  app.get('/users/houseId', userController.getHouseIdwithUserId)
  //app.get('/users/house', userController.checkIfUserHasHouse)

  //Messages
  app.get('/messages', Auth.isLoggedInUser, messageController.get);
  app.post('/messages', Auth.isLoggedInUser, messageController.post);
  //Landlord Messages
  app.get('/messages/landlord', Auth.isLoggedInUser, messageController.getLandlordChat)
  app.post('/messages/landlord', Auth.isLoggedInUser, messageController.postToLandlordChat)

  //Chores
  app.get('/chores/', Auth.isLoggedInUser, choreController.get);
  app.post('/chores', Auth.isLoggedInUser, choreController.post);
  app.put('/chores/:choreId', Auth.isLoggedInUser, choreController.put);
  app.delete('/chores/:choreId', Auth.isLoggedInUser, choreController.delete);

  //Payments
  app.get('/payment/pay', Auth.isLoggedInUser, paymentController.getWhatYouOwe);
  app.get('/payment/owed', Auth.isLoggedInUser, paymentController.getWhatIsOwedToYou);
  app.get('/payment/owed/:houseId', Auth.isLoggedInUser, paymentController.getPaymentsByHouseId);
  app.get('/payment/completed', Auth.isLoggedInUser, paymentController.getWhatYouHavePaid);
  app.get('/payment/completed/owed', Auth.isLoggedInUser, paymentController.getWhatHasBeenPaidToYou);
  app.post('/payment', Auth.isLoggedInUser, paymentController.postPayment);
  app.post('/payment/bill', Auth.isLoggedInUser, paymentController.postBill);
  app.put('/payment/:paymentId', Auth.isLoggedInUser, paymentController.markPaymentAsPaid);

  //Houses
  app.put('/houses/users', houseController.updateUserHouseId);
  app.get('/houses/:token', houseController.getHousebyHouseId);
  app.post('/houses', houseController.postHouse);
  app.get('/houses/token/:houseId', houseController.getHouseToken);
  app.get('/housez/code', houseController.getHouseCode);

  //Landlord
  app.get('/properties/owned', landlordController.getHousesOwned);
  app.get('/properties/initial', landlordController.getLandlordPropertyOnLogin);
  app.get('/properties/view/:houseId', landlordController.updateLandlordsCurrentHouse);
  app.put('/properties/add/:houseToken', landlordController.addProperty);
  app.post('/properties/create', houseController.createHouse);
  app.put('/property/landlord/house', landlordController.giveLandlordDummyHouseID);
  app.get('/property/landlord/tokenUpdate', landlordController.updateLandlordsToken);

  app.get('/direct', Auth.decodeJwt, function(req, res) {
    console.log('has token: ', req.user);
    if (!req.user || !req.user.userid) {
      console.log('redirect to login')
      res.json('login');
    } else if (!req.user.houseId) {
      console.log('redirect to registration')
      res.json('registration');
    } else if (req.user.isLandlord) {
      console.log('redirect to landlord') 
      res.json('landlord');
    } else if (!req.user.isLandlord) {
      console.log('redirect to tenant')
      res.json('tenant');
    } else {
      res.sendStatus(404);
    }
  });

  app.use('/saveToken', express.static('client/auth'));
  app.use('/login', express.static('client/login'));
  // add middleware
    // if landlord redirect to /landlord
    // if user call next()
    // if neither, send to login
  app.use('/', function(req, res, next) {
    console.log('hit root..');
    next();
  }, express.static('client/auth'));
  app.use('/tenant', express.static('client'));
  // add similar middleware here
  app.use('/landlord', express.static('landlordclient'));
  app.use('/registration', express.static('client/registration'));

  app.get('/obie', function(req, res) {
    res.send(req.session.jwt);
  });
  app.get('/obie/update', function(req, res) {
    console.log('HIT GET: OBIE/UPDATE')
    var token = jwt.decode(req.headers.token, process.env.secret_code);

    if (!token.houseId) {
      request({
        url: process.env.Base_URL +'/users/houseId',
        method: 'GET',
        headers: {token: req.headers.token}
      }, function(error, response, body) {
        console.log('body: ', body);
        token.houseId = JSON.parse(body)[0].houseId;
        console.log('new token, should have houseId: ', token);
        console.log('2... new token, should have houseId: ', token);
        var encodedToken = jwt.encode(token, process.env.secret_code);
        req.session.regenerate(function() {
          req.session.jwt = encodedToken;
        });
        res.json(encodedToken);
      });
    } else {
      var encodedToken = jwt.encode(token, process.env.secret_code);
      res.json(encodedToken);
    }

  });
  app.get('/obie/updateLeaveHouse', tokenController.updateAfterLeaveHouse);


  app.get('/obie/tokenChange', tokenController.updateToken);

  //Login/Logout
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });

  //Pay a user
  app.post('/auth/venmo/payment', paymentController.makeVenmoPayment);
}
  
