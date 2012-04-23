var session = {};

module.exports = exports = {
    get: function(key, callback) {
      process.nextTick(function() {
      callback(session[key]);
    });
    
  },

  set: function(key, value, callback) {
    process.nextTick(function() {
      session[key] = value;
      if (callback) callback(true);
    });
  }
};
