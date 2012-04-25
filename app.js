require('console-trace')
console.traceAlways = true;

var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)
  , routes = require('./routes')
  , lessMiddleware = require('less-middleware')
  , ejsLayoutSupport = require('./lib/ejsLayoutSupport')
  , io = require('socket.io').listen(server);
  
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(lessMiddleware({
         src: __dirname + '/public',
         force: true,
         once: false,
         debug: false,
         compress: false
     }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(ejsLayoutSupport);
  app.use(app.router);
  
  app.use(function(err, req, res, next){
    res.render('500.html.ejs', {
        status: err.status || 500
      , error: err
    });
  });
  
  app.use(function(req, res){
     res.render('404.html.ejs');
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.session = require('./lib/memoryStore');
});

app.configure('staging production', function(){
  app.use(express.errorHandler());
  app.session = require('./lib/redisStore');
  
  app.use(lessMiddleware({
         src: __dirname + '/public',
         force: false,
         once: true,
         debug: false,
         compress: true
     }));
});

app.get('/:hash?'           , routes.index);
app.post('/'                , routes.createMeeting);

var Meeting = require('./model/meeting');
io.sockets.on('connection', function (socket) {
  
  socket.on('syncRequest', function(meetingId, ack) {
    Meeting.find(meetingId, function(meeting) {
      if (!meeting) ack(null);
      else ack(meeting.clientModel());
    });
  });
  
  socket.on('join', function(data, ack) {
    var rate = data.rate;
    var meetingId = data.meetingId;
    
    rate = parseFloat(rate.toString().replace(",", "."));

    Meeting.find(meetingId, function(meeting) {
      if (!meeting)
        res.send("Can't find that meeting", 404);
      else {
        meeting.addAttendee(rate);
        var clientModel = meeting.clientModel();

        ack(clientModel);
        socket.volatile.broadcast.emit('sync', clientModel);
      }
    });
  });
  
  socket.on('leave', function(data, ack) {
    var rate = data.rate;
    var meetingId = data.meetingId;
    
    rate = parseFloat(rate.toString().replace(",", "."));

    Meeting.find(meetingId, function(meeting) {
      if (!meeting)
        res.send("Can't find that meeting", 404);
      else {
        meeting.removeAttendee(rate);
        var clientModel = meeting.clientModel();

        ack(clientModel);
        socket.volatile.broadcast.emit('sync', clientModel);
      }
    });
  });
});

var port = app.settings.env == 'development' ? 3333 : 80;
server.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);

