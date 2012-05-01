var express = require('express')
  , app = express()
  , conf = require('./config')(app.settings.env)
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , lessMiddleware = require('less-middleware')(conf.lessMiddleware)
  , expressLayouts = require('express-ejs-layouts')
  , routes = require('./routes')

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set("layout extractScripts", true);

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(lessMiddleware);
  app.use(assetManagerMiddleware)
  app.use(express.static(__dirname + '/public'));
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

app.get('/:hash?'           , routes.index);
app.post('/'                , routes.createMeeting);
app.post('/join/:hash'      , routes.joinMeeting);
app.post('/leave/:hash'     , routes.leaveMeeting);


require('./model/realtime-engine')(io);

app.locals.env = app.settings.env
var port = app.settings.env == 'production' ? 80 : 3333;
server.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
