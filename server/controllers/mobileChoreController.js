var choreModel = require('../models/choreModel.js');

module.exports = {
  get: function(req, res){
    console.log('got here')
    var params = [req.params.houseId];
    choreModel.get(params, function(err, results) {
      if(err){
        res.sendStatus(500);
      }
      res.json(results)
    });
  },

  post: function (req, res) {
    console.log('POST CHORES TOKEN: ', token);   
    var params = [req.body.userId, req.body.name, req.body.category, req.body.dueDate, houseId];
    choreModel.post(params, function (err, results) {
      if (err) {
        res.sendStatus(500);
      }
      res.status(201).json(results);
    });
  },
}
