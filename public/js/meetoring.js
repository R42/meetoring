// Create a namespace for our javascript
var Meetoring = {};

var post = function(url, data, callback) {
  
  var success = function(data, textStatus, jqXHR) {
    callback(null, data);
  };
  
  var error = function(jqXHR, textStatus, errorThrown) {
    callback(textStatus, null);
  };
  
  $.ajax({
		type: 'POST',
		url: url,
		data: data,
		success: success,
		error: error,
		dataType: 'json'
	});
};

Meetoring.joinMeeting = function(meetingId, rate, callback) {
  Meetoring.currentMeetingId = meetingId;
  Meetoring.currentRate = rate;
  post('/join/' + meetingId, {rate: rate}, callback);
};

Meetoring.leaveMeeting = function(callback) {
  post('/leave/' + Meetoring.currentMeetingId, {rate: Meetoring.currentRate}, callback);
};