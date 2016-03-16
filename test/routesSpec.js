var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
// var UserController = require('../../server/controllers/userControllers.js').createNewUser;
chai.use(chaiHttp);
var app = 'http://localhost:8080';

describe('API Routes', function() {
  describe('user controller', function() {
    it( 'should create a new user', function(done) {
      var newUser = {
        name: "Joey",
        venmoName: "Joey",
        username: "Jballz",
        email: "joey@aol.com",
        provider: "venmo",
        venmo: "{}",
        balance: 33.33,
        access_token: "somelongstring11111",
        refresh_token: "someotherstring9999",
        venmoid: 4444444
      };
      chai.request(app)
        .post('/users')
        .send(newUser)
        .end(function (err, res) {
           expect(err).to.be.null;
           expect(res).to.have.status(200);
           done();
        });
    });
    it('should be able to find a user by their venmoid', function(done) {
      chai.request(app)
        .get('/users/venmo/4444444')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body[0].venmoName).to.equal('Joey');
          done();
        })
    });
    it('should update a user', function(done) {
      var updateData = {
        balance: 10.88,
        venmo: '{status: "updated"}',
        venmoid: 4444444
      };
      chai.request(app)
        .put('/users')
        .send(updateData)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
    })
  });
  describe('house controller', function() {
    it('should create a new house', function(done) {
      var newHouse = {
        name: "Test House",
        address: "101 First St. Oakland, CA"
      };
      chai.request(app)
        .post('/houses')
        .send(newHouse)
        .end(function (err, res) {
           expect(err).to.be.null;
           expect(res).to.have.status(200);
           done();
        });
    });
    
  });
})








