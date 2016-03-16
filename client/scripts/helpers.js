var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

module.exports = {
  getDate: function(dateString) {
    var dateArray = dateString.split('-');
    var day = dateArray[2].split('T')[0]
    return {
      year: dateArray[0],
      month: dateArray[1],
      day: day
    }
  },
  getDateTime: function(dateTimeString) {
    var utcString=dateTimeString+" UTC";
    return new Date(utcString).toLocaleTimeString("en-us", options);
  }
}
