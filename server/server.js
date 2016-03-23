var passport = require('passport');
var VenmoStrategy = require('passport-venmo').Strategy;
var request = require('request')
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db/index');
var cors = require('cors');

var user = require('./controllers/userController');

var jwt = require('jwt-simple');
//set this on heroku

// if(!process.env.deployCheck){
//   require('dotenv').load();  

// }
require('dotenv').load();

var Venmo_Client_ID = process.env.venmo_client_ID;
var Venmo_Client_SECRET = process.env.venmo_client_secret;
var Venmo_Callback_URL = process.env.Base_URL +'/auth/venmo/callback';

app.set('port', (process.env.PORT || 8080));

var server = app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
  socket.on('message', function(data) {
    io.sockets.emit('message', data); // broadcast to all but the sender
  });
  socket.on('llmessage', function(data) {
    io.sockets.emit('llmessage', data); // broadcast to all but the sender
  });
  socket.on('chore', function(data) {
    io.sockets.emit('chore', data); // broadcast to all but the sender
  });
  socket.on('bill', function(data) {
    io.sockets.emit('bill', data); // broadcast to all but the sender
  });
})


app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'client')));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new VenmoStrategy({
    clientID: Venmo_Client_ID,
    clientSecret: Venmo_Client_SECRET,
    callbackURL: Venmo_Callback_URL
  },
  function(accessToken, refreshToken, venmo, done) {
    var obj= {}
    obj.name = venmo.displayName;
    obj.venmoName = venmo.displayName;
    obj.username = venmo.username;
    obj.email = venmo.email;
    obj.provider = venmo.provider;
    obj.venmo = venmo._raw;
    obj.balance = venmo.balance;
    obj.access_token = accessToken;
    obj.refresh_token = refreshToken;
    obj.venmoid = venmo.id;
    obj.userImageUrl = venmo._json.profile_picture_url || null;


    var jtObj = {};
    jtObj.email = venmo.email;
    jtObj.access_token = accessToken;

    request.get(process.env.Base_URL +'/users/venmo/'+ venmo.id, function(err, resp, body) {

      if (!err && resp.statusCode == 200) {
        if (JSON.parse(body).length === 0){

          request({
            url: process.env.Base_URL +'/users', //URL to hit
            method: 'POST',
            json: obj //Set the body as a string
          }, function(error, response, body){
              if(error) {
                console.log('post error', error);
                return done(error);
              } else {
                jtObj['userid']=body;
                var jwtObj = jwt.encode(jtObj, process.env.secret_code);
                return done(null, jwtObj);
              }
          });
        }
        else {
          request({
            url: process.env.Base_URL +'/users', //URL to hit
            method: 'PUT',
            json: obj
          }, function (error, response, body) {
            if (error) {
              return done(error);
            } else {
              request.get(process.env.Base_URL +'/users/id/' + venmo.username, function(error, response, body) {
                body=JSON.parse(body);
                var userId = body[0]['id'] ||null;
                var houseId = body[0]['houseId'] || null;
                var isLandlord = body[0]['isLandlord'] || null;
                jtObj['userid'] = userId;
                jtObj['houseId'] = houseId;
                jtObj['isLandlord'] = isLandlord;
                var jwtObj = jwt.encode(jtObj, process.env.secret_code);
                return done(null, jwtObj);
              })

            }
          });
        }
      } else {
        console.log("get error", err)
        return done(err);
      }
    })
  }
));

require('./config/routes.js')(app, express);

module.exports = app;
