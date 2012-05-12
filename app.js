var express = require('express');
var http = require('http');
var util = require('util');

var app = express();
var conf = require('./config')(app.settings.env);
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var lessMiddleware = require('less-middleware')(conf.lessMiddleware);
var expressLayouts = require('express-ejs-layouts');

var Meeting = require('./meeting');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set("layout extractScripts", true);

  app.use(express.favicon('public/icon.ico'))

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.compress())
  app.use(lessMiddleware);
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(expressLayouts);
  app.use(app.router);

  app.use(function(req, res){
     res.render('404.html.ejs');
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  require('console-trace');
  console.traceAlways = true;
});

app.configure('production', 'stage', function(){
  app.use(express.errorHandler());
});

var meetings = {};

app.get('/' , function(req, res, next) {
  res.render('home');
});

app.get('/:meetingId' , function(req, res, next) {
  var id = req.params.meetingId;
  if (!meetings.hasOwnProperty(id)) {
    next();
    return;
  }
  
  res.render('meeting', { meeting: meetings[id].clientModel() })
});
app.post('/', function(req, res, next){

  var meeting = new Meeting(req.body.meetingName);

  meetings[meeting.id] = meeting;
  
  var rt = io.of('/' + meeting.id);

  rt.on('connection', function(socket) {
    
    var id = require('identifier')(40);

    socket.on('join', function(rate, fn) {
      meeting.addAttendee(id, rate);
      var clientModel = meeting.clientModel();
      fn(clientModel);
      rt.emit('update', clientModel);
    });

    socket.on('leave', function(fn) {
      meeting.removeAttendee(id);
      var clientModel = meeting.clientModel();
      fn(clientModel);
      rt.emit('update', clientModel);
    });
    
    socket.on('sync', function(fn) {
      fn(meeting.clientModel());
    });
    
    socket.on('disconnect', function(socket) {
      meeting.removeAttendee(id);
      var clientModel = meeting.clientModel();
      rt.emit('update', clientModel);
    });
  });
  
  res.redirect('/' + meeting.id);
});

app.locals.env = app.settings.env

var port = 3333;
server.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
