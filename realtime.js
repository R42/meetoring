var identifier = require('identifier');

function setupRealtime(app, meeting) {
  
    var io = app.get('io');
    var rt = io.of('/' + meeting.id);

    function acknowledgeAndUpdate(fn) {
      var clientModel = meeting.clientModel();
      fn(clientModel);
      rt.emit('update', clientModel);
    }

    rt.on('connection', function(socket) {
      
      var clientId = socket.id;

      socket.on('identify', function(id, fn) {
        clientId = id;
        fn(meeting.clientModel());
      });

      socket.on('sync', function(fn) {
        fn(meeting.clientModel());
      });

      socket.on('join', function(rate, fn) {
        meeting.addAttendee(clientId, rate);
        acknowledgeAndUpdate(fn);
      });

      socket.on('leave', function(fn) {
        meeting.removeAttendee(clientId);
        acknowledgeAndUpdate(fn);
      });
    });
}

module.exports = exports = setupRealtime;