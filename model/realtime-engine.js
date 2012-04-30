module.exports = exports = realtime;


var MeetingRealtimeEngine = require('./meeting-realtime-engine');
function realtime(io){
  io
  .of('/meeting')
  .on('connection', function (socket) { MeetingRealtimeEngine(socket); });
}