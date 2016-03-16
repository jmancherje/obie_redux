var mobileUserModel = require('../models/mobileUserModel.js')

module.exports = {
  getUserHouseIdWithEmail: function(req, res){
    var params = [req.params.email];
    mobileUserModel.getUserHouseIdWithEmail(params, function(err, results){
      if(err) {
        res.sendStatus(500);
      } else {
        res.json(results)
      }
    });
  },

  getUsersInHouse: function(req, res) {
    var params = [req.params.houseId];
    console.log('mobile user params', params);
    mobileUserModel.getUsersInHouse(params, function(err, results){
      if(err){
        res.sendStatus(500);
      } else {
        console.log(results);
        res.json(results)
      }
    });
  }
}
