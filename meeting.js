var identifier = require('identifier');
var _  = require('lodash');

function getTime() {
  var now = new Date();
  var utc = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds());
  return utc;
}

function Meeting (name) {
  this.id = identifier(3);
  this.name = name;
  this.attendees = [];
  this.total = 0;
  this.rate = 0; // per second
  this.timeStamp = new Date();
}

Meeting.prototype = {
  
  addAttendee: function(id, ratePerHour) {
    var rate = ratePerHour / 3600 ;
    
    this.attendees.push({ id: id, rate: rate });
    this.updateRate(rate);
  },
  
  removeAttendee: function(id) {
    var attendee = _.find(this.attendees, function(attendee) { return attendee.id == id; });
    var index = _.indexOf(this.attendees, attendee);
    
    if (index == -1) {
      return;
    }

    var rate = this.attendees[index].rate;

    this.attendees.splice(index, 1);
    this.updateRate(-rate);
  },
  
  updateTotal: function() {
    var newTimestamp = getTime();
    var timespanMillis = newTimestamp - this.timeStamp;
    this.timeStamp = newTimestamp;
    
    this.total += this.getRate() * ( timespanMillis / 1000 );
  },
  
  updateRate: function(rate) {
    this.updateTotal();
    this.rate += rate;
  },
  
  getRate: function() { return this.rate; },
  getTotal: function() { this.updateTotal(); return this.total; },
  getAttendees: function() {
    return _.map(this.attendees, function (attendee) { return attendee.id; });
  },
  
  clientModel: function() {
    return {
      rate: this.getRate(),
      total: this.getTotal(),
      timestamp: +getTime(),
      id: this.id,
      name: this.name,
      attendees: this.getAttendees()
    };
  }
};

module.exports = exports = Meeting;