module.exports = exports = function(env) {

  var inDev = env == 'development', notInDev = !inDev;
  var inProd = env == 'production', notInProd = !inProd;

  var conf = {};
  conf.lessMiddleware = {
       src: __dirname + '/public',
       force: inDev,
       once: notInDev,
       debug: false,
       compress: notInDev
   };
   
   conf.shorterDomain = inProd ? 'meetor.in' : '';

  return conf;
};