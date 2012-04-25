var crc32 = require('../lib/crc32');
var storage = require('../lib/memoryStore');
var _ = require('underscore');

var Meeting = function (name){    
    this._id = crc32(name);
    this._name = name;
    this._attendees = [];
    this._total = 0;
    this._rate = 0; // per second -- 3 600 000 millis
    this._timeStamp = new Date();
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
  
  addAttendee: function(ratePerHour) {
    var rate = ratePerHour / 60 ;
    this._attendees.push(rate);
    
    this.updateRate(rate);
  },
  
  removeAttendee: function(ratePerHour) {
    var rate = ratePerHour / 3600 ;
    var index = _.indexOf(this._attendees, rate);
    
    if (index == -1) {
      console.log('Tried to remove an attendee that could not be found');
      return;
    }
    
    this._attendees.splice(index, 1);
    
    this.updateRate(-rate);
  },
  
  updateTotal: function() {
    var newTimestamp = new Date();
    var timespanMillis = newTimestamp - this._timeStamp;
    this._timeStamp = newTimestamp
    
    this._total += this.getRate() * timespanMillis / 1000;
  },
  
  updateRate: function(rate) {
    this.updateTotal();
    this._rate += rate;
  },
  
  getRate: function() { return this._rate; },
  getTotal: function() { this.updateTotal(); return this._total; },
  
  clientModel: function() {
    return {
      rate: this.getRate().toFixed(2),
      total: this.getTotal().toFixed(2),
      id: this._id,
      name: this._name
    };
  }
};

module.exports = exports = Meeting;