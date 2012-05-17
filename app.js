var express = require('express');
var http = require('http');

var app = express();
var config = require('./config')(app.settings.env);
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var lessMiddleware = require('less-middleware')(config.lessMiddleware);
var expressLayouts = require('express-ejs-layouts');
var setupHandlers = require('./handlers.js');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set("layout extractScripts", true);

  app.set("io", io);
  app.set("config", config);

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

setupHandlers(app);

app.locals.env = app.settings.env;

var port = 3333;
server.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
