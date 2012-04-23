module.exports = exports = function(req, res, next) {
  var render = res.render;
  res.render = function(view, options, fn) {
    
    var options = options || {};
    
    // support callback function as second arg
    if ('function' == typeof options) {
      fn = options, options = {};
    }
    
    render.call(res, view, options, function(err, str){ 
      if (err) {
        if (fn) fn(err);
        return;
      }
      
      var script = '';
      var body = str;
      
      var regex = /\<script(.|\n)*?\>(.|\n)*?\<\/script\>/g
      if (regex.test(str)) {
        body = str.replace(regex, '');
        script = str.match(regex).join('\n');
      }
      
      render.call(res, options.layout || 'layout', { body: body, script: script });
      
      if (fn) 
        fn(err, str);
    });
  };
  
  next();
};