var   crc32         = require('../lib/crc32')
    , storage       = require('../lib/memoryStore')
    , _             = require('underscore')
    , EventEmitter  = require('events').EventEmitter;
        

//private Method - Meeting Unique Id Generator 
function meetingUUID(name){
  var id = +new Date + "#" + name; 
  var UUID = crc32(id);
  return UUID;
}

function Meeting (name){
   if(false === (this instanceof Meeting)) {
      return new Meeting();
   }

    this._id = meetingUUID(name);
    this._name = name;
    this._attendees = [];
    this._total = 0;
    this._rate = 0; // per second -- 3 600 000 millis
    this._timeStamp = new Date();
    this._class = Meeting;
    
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
  
  addAttendee: function(viewerId, ratePerHour) {
    var rate = ratePerHour / 3600 ;
    
    this._attendees.push(ratePerHour + "");
    
    this.updateRate(rate);
    this._class.emit("meeting:attendee:colaborator:added", { meeting: { id: this._id, rate: this.getRate(), total: this.getTotal() }, client: viewerId });
    
  },
  
  removeAttendee: function(viewerId, ratePerHour) {
    var rate = ratePerHour / 3600 ;
    
    var index = _.indexOf(this._attendees, ratePerHour+"");
    
    if (index == -1) {
      console.log('Tried to remove an attendee that could not be found');
      return;
    }
    
    this._attendees.splice(index, 1);
    this.updateRate(-rate);
    this._class.emit("meeting:attendee:colaborator:removed", {meeting: this.clientModel() , client: viewerId});
    
  },
  
  updateTotal: function() {
    var newTimestamp = new Date();
    var timespanMillis = newTimestamp - this._timeStamp;
    this._timeStamp = newTimestamp
    
    this._total += this.getRate() * ( timespanMillis / 1000 );
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

Meeting.__proto__ = EventEmitter.prototype;
EventEmitter.call(Meeting);


module.exports = exports = Meeting;