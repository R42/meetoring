var redis = require("redis").createClient()

module.exports = exports = {
  get: function(key, callback) {
    redis.get(key, function(error, value) {
      if (error) callback(null);
      else callback(JSON.parse(value));
    });
  },

  set: function(key, value, callback) {
    process.nextTick(function() {
      redis.set(key, JSON.stringify(value));
      if (callback) callback(true);
    });
  }
};

