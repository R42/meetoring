require('console-trace')
console.traceAlways = true;

var express = require('express')
  , routes = require('./routes')
  , socketio = require('socket.io')
  , lessMiddleware = require('less-middleware')
  , ejsLayoutSupport = require('./ejsLayoutSupport')

var app = module.exports = express.createServer();
var io = socketio.listen(app);

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
         compress: false,
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
  app.session = require('./app_session');
});

app.configure('staging production', function(){
  app.use(express.errorHandler());
  app.session = require('./redis_app_session');
  
  app.use(lessMiddleware({
         src: __dirname + '/public',
         force: false,
         once: true,
         debug: false,
         compress: true,
     }));
});

app.get('/:hash?', routes.index);
app.post('/', routes.createMeeting);
app.post('/join/:hash'     , meeting.handlers.joinMeeting);
app.post('/leave/:hash'     , meeting.handlers.leaveMeeting);

io.sockets.on('connection', function (socket) {
    socket.on('attendee:hello', function(data){
      // 
    });
});

var port = app.settings.env == 'development' ? 3333 : 80;
app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
