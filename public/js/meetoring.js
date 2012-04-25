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

Meetoring.joinMeeting = function(meetingId, rate, clientId, callback) {
  Meetoring.currentMeetingId = meetingId;
  Meetoring.currentRate = rate;
  Meetoring.clientId= clientId;
  post('/join/' + meetingId, {rate: rate, clientId: clientId}, callback);
};

Meetoring.leaveMeeting = function(callback) {
  post('/leave/' + Meetoring.currentMeetingId, { rate: Meetoring.currentRate, clientId: Meetoring.clientId }, callback);
};