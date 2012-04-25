require('console-trace')
console.traceAlways = true;

var express = require('express')
  , routes = require('./routes')
  , lessMiddleware = require('less-middleware')
  , ejsLayoutSupport = require('./lib/ejsLayoutSupport')
  , app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);
  , io = require('socket.io').listen(server)
  , Meeting = routes.model
  
console.log(io);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(lessMiddleware({
         src: __dirname + '/public',
         force: true,
         once: false,
         debug: true,
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
app.post('/join/:hash'      , routes.joinMeeting);
app.post('/leave/:hash'     , routes.leaveMeeting);


io.sockets.on('connection', function (socket) {
    socket.emit("name please?", {});
    socket.on('my identification is', function(data){
      var meetingId = data.meeting.id;
      var clientId = data.meeting.clientId;
      Meeting.setSocket(meetingId, clientId, socket);
    });
});



var port = app.settings.env == 'development' ? 3333 : 80;
app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
