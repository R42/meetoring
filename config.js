module.exports = exports = function(env) {

  var inDev = env == 'development', notInDev = !inDev;

  var conf = {};
  conf.lessMiddleware = {
       src: __dirname + '/public',
       force: inDev,
       once: notInDev,
       debug: false,
       compress: notInDev
   };

  return conf;
};