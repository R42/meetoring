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
    
      var id = identifier(40);

      socket.on('sync', function(fn) {
        fn(meeting.clientModel());
      });

      socket.on('join', function(rate, fn) {
        meeting.addAttendee(id, rate);
        acknowledgeAndUpdate(fn);
      });

      socket.on('leave', function(fn) {
        meeting.removeAttendee(id);
        acknowledgeAndUpdate(fn);
      });
    
      socket.on('disconnect', function(socket) {
        meeting.removeAttendee(id);
      });
    });
}

module.exports = exports = setupRealtime;