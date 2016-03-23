var AWS = require('aws-sdk');
var ak = 'AKIAJPE64XRMRH3U3RXQ';
var sk = 'GGKset15Tg4yABvaZxn9z2/zku8oVFHlcbUxNEC/';

module.exports = {
  uploadImage: function(req, res) {

    var s3bucket = new AWS.S3({params: {Bucket: 'obietestbucket'}});
    s3bucket.createBucket(function() {
      var params = {Key: 'testKey', Body: 'test body'};
      s3bucket.upload(params, function(err, data) {
        if (err) {
          console.log('error uploading data: ', err);
        } else {
          console.log('successfully uploaded data to obietestbucket', params.key, params.body);
        }
      })
    })

  }
}