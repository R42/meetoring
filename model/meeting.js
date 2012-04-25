var crc32 = require('../lib/crc32');
var storage = require('../lib/memoryStore');
var _ = require('underscore');


//Private Function
function meetingUUID(name){
  var id = +new Date + "#" + name; 
  var UUID = crc32(id);
  return UUID;
}

var Meeting = function (name){    
    this._id = meetingUUID(name);
    this._name = name;
    this._attendees = [];
    this._total = 0;
    this._rate = 0; // per second -- 3 600 000 millis
    this._timeStamp = new Date();
    this._class = Meeting;
};


Meeting._sockets = {};

Meeting.find = function(hash,callback){
   storage.get(hash, callback);
};

Meeting.setSocket = function(meetindId, clientId, socket){
  var clients = this._sockets[meetindId];
  if(!clients) this._sockets[meetindId] = {};
  this._sockets[meetindId][clientId] = socket;
};

Meeting.notifyOthers = function(clientId, meetindId){
  var me = this._sockets[meetindId][clientId];
  if(me) me.broadcast.emit("attendee:notification");
};


Meeting.prototype = {
   new_record: function(){
    return this._id !== undefined && this._id !== null;
  },

  save: function(callback) {
    var bool = storage.set(this._id, this, callback);
  },
  
  addAttendee: function(clientId, ratePerHour) {
    var rate = ratePerHour / 3600 ;
    this._attendees.push(rate);
    
    this.updateRate(clientId, rate);
    
  },
  
  removeAttendee: function(clientId, ratePerHour) {
    var rate = ratePerHour / 3600 ;
    var index = _.indexOf(this._attendees, rate);
    
    if (index == -1) {
      console.log('Tried to remove an attendee that could not be found');
      return;
    }
    
    this._attendees.splice(index, 1);
    
    this.updateRate(clientId, -rate);
  },
  
  updateTotal: function() {
    var newTimestamp = new Date();
    var timespanMillis = newTimestamp - this._timeStamp;
    this._timeStamp = newTimestamp
    
    this._total += this.getRate() * ( timespanMillis / 1000 );
  },
  
  updateRate: function(clientId ,rate) {
    this.updateTotal();
    this._rate += rate;
    debugger
    this._class.notifyOthers(clientId, this._id);
    
  },
  
  getRate: function() { return this._rate; },
  getTotal: function() { this.updateTotal(); return this._total; },
  
  clientModel: function() {
    return {
      rate: this.getRate().toFixed(2),
      total: this.getTotal().toFixed(2),
      id: this._id,
      name: this._name,
      clientId: +new Date
    };
  }
};

module.exports = exports = Meeting;