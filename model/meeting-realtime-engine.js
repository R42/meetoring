var Meeting = require('./meeting')
, _ = require('underscore');


function MeetingRealtimeEngine(socket){
  socket.on('meeting:attendee:spectator:entered', function(data){
    var meetingId = data.meeting.id;
    var clientId  = data.meeting.clientId;
    Meeting.emit('meeting:attendee:spectator:entered', { meeting: {id: meetingId}, socket: socket });
  });
  
  socket.on('meeting:resync', function(data){
    var id = data.meeting.id;
    Meeting.find(id, function (meeting) {
    if(meeting !== undefined && meeting !== null) Meeting.emit('meeting:resync', { meeting: meeting,  socket: socket });
  });
  
  });
}

Meeting.on('meeting:resync'                         , function(data){
  multicastEveryone(data.meeting.clientModel());
});


Meeting.on("meeting:attendee:spectator:entered"     , function(data){
    var meeting = data.meeting
    , socket = data.socket
    , client = socket.id;

    multicast[meeting.id] = multicast[meeting.id] || {attendees: {spectators: [] , colaborators: [] } }; 
    multicast[meeting.id].attendees.spectators.push(""+ client);
    multicast[meeting.id][client] = socket;
});

Meeting.on("meeting:attendee:colaborator:added"   , function(data){
    var client = data.client
    , meeting = data.meeting
    , viewers = multicast[meeting.id];
  
    var index = viewers.attendees.spectators.indexOf(client);
    if (index == -1 ) return;
  
    viewers.attendees.colaborators.push( client );
    viewers.attendees.spectators.splice(index, 1);
    multicastOthes(client, meeting);

});

Meeting.on("meeting:attendee:colaborator:removed"   , function(data){
   var client = data.client
    , meeting = data.meeting
    , viewers = multicast[meeting.id];
      
    var index = viewers.attendees.colaborators.indexOf(client);
    if (index == -1 ) return;
  
    viewers.attendees.spectators.push( client );
    viewers.attendees.colaborators.splice(index, 1);
    multicastOthes(client, meeting);
    
});

var multicast = {};

function emitMulticast(client, meeting, includeMe){
  var multicastMeeting = multicast[meeting.id]
    , includeMe = includeMe || false;

  if( multicastMeeting !== undefined ||  multicastMeeting !== null) {
    _.each( _.union(multicastMeeting.attendees.spectators , multicastMeeting.attendees.colaborators), function(_client){
      if( ! includeMe && client == _client) return;
      multicast[meeting.id][_client].emit("sync:rate", meeting);
    });
  }
}

function multicastEveryone(meeting){
    return emitMulticast('_', meeting, true);
}

function multicastOthes(clientId, meeting){
  return emitMulticast(clientId, meeting, false);
}



module.exports = exports = MeetingRealtimeEngine;