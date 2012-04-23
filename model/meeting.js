var crc32 = require('../lib/crc32');
var storage = require('../lib/memoryStore');
var _ = require('underscore');

var Meeting = function (name){    
    this._id = crc32(name);
    this._name = name;
    this._attendees = [];
    this._total = 0;
    this._rate = 0; // per minute -- 60000 millis
    this._timeStamp;
};

Meeting.find = function(hash,callback){
   storage.get(hash, callback);
};

Meeting.prototype = { 
  new_record: function(){
    return this._id !== undefined && this._id !== null;
  },

  save: function(callback) {
    var bool = storage.set(this._id, this, callback);
  },
  
  addAttendee: function(rate_per_hour) {
    var rate_per_minute = rate_per_hour / 60 ;
    this._attendees.push(rate_per_minute);
    
    if (!this._timeStamp) {
      this._rate = rate_per_minute;
      this._timeStamp = new Date();
      return;
    }

    this.updateRate(rate_per_minute);
  },
  
  removeAttendee: function(rate) {
    var index = _.indexOf(this._attendees, rate);
    
    if (index == -1) return;
    
    this._attendees.splice(index, 1);
    
    this.updateRate(-rate);
  },
  
  updateRate: function(rate) {
    var newTimestamp = new Date();
    var timespanMillis = newTimestamp - this._timeStamp;
    this._timeStamp = newTimestamp
    
    this._total += this._rate * timespanMillis / 60000;
    this._rate += rate;
  },
  
  getRate: function() { return this._rate; },
  getTotal: function() { return this._total; },
  
  clientModel: function() {
    return {
      rate: this.getRate(),
      total: this.getTotal(),
      id: this._id,
      name: this._name
    };
  }
};

module.exports = exports = Meeting;