
/**
 * Module dependencies.
 */

var express = require('express')
  , redis = require("redis").createClient()
// , RedisStore = require('connect-redis')(express)
    
  , routes = require('./routes')
  ;

var redisWrapper = {
  get: function(key, callback) {
    redis.get(key, function(error, value) {
      if (error) console.log('Redis error: ' + error);
      else callback(JSON.parse(value));
    });
  },

  set: function(key, value) {
    redis.set(key, JSON.stringify(value));
  }
};

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.use(express.bodyParser());
//  app.use(express.methodOverride());
  
  app.use(express.cookieParser());
  // app.use(express.session({ secret: "read_this_froma_file_listed_in_gitignore", store: new RedisStore }));
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.session = redisWrapper;
  
  app.helpers({
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/:hash?', routes.index);
app.post('/', routes.createMeeting);
  
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);