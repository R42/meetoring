var identifier = require('identifier');
var _  = require('lodash');

function Meeting (name){
  this.id = identifier(3);
  this.name = name;
  this.attendees = [];
  this.total = 0;
  this.rate = 0; // per second
  this.timeStamp = new Date();
  this.class = Meeting;
};

Meeting.prototype = {
  
  addAttendee: function(id, ratePerHour) {
    debugger
    var rate = ratePerHour / 3600 ;
    
    this.attendees.push({ id: id, rate: rate });
    this.updateRate(rate);
  },
  
  removeAttendee: function(id) {
    var attendee = _.find(this.attendees, function(attendee) { return attendee.id == id });
    var index = _.indexOf(this.attendees, attendee);
    
    if (index == -1) {
      return;
    }

    var rate = this.attendees[index].rate;

    this.attendees.splice(index, 1);
    this.updateRate(-rate);
  },
  
  updateTotal: function() {
    var newTimestamp = new Date();
    var timespanMillis = newTimestamp - this.timeStamp;
    this.timeStamp = newTimestamp
    
    this.total += this.getRate() * ( timespanMillis / 1000 );
  },
  
  updateRate: function(rate) {
    this.updateTotal();
    this.rate += rate;    
  },
  
  getRate: function() { return this.rate; },
  getTotal: function() { this.updateTotal(); return this.total; },
  
  clientModel: function() {
    return {
      rate: this.getRate().toFixed(2),
      total: this.getTotal().toFixed(2),
      id: this.id,
      name: this.name,
      attendeesCount: this.attendees.length
    };
  }
};

module.exports = exports = Meeting;