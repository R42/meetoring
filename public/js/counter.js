(function(global){
  
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
  
  function ticker(self) {
    self.total += self.rate * self.delay / 1000;
    self.render();
  }

  var Class = function (container, delay, duck){
    this.container = container;
    this.delay =   delay;
    this.rate = 0;
    this.interval = null;
    this.sync(duck);
  };

  Class.prototype = {
    sync: function(duck){
      this.totalAtTimestamp = parseFloat(duck.total);
      this.rate = parseFloat(duck.rate);
      this.timestamp = getTime();
      
      var self = this;
      function ticker() {
        self.refresh();
      }

      if (this.rate != 0 && this.interval == null) {
        this.interval = setInterval(ticker, this.delay + 30);
      } else if (this.rate == 0 && this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    
    refresh: function() {
      var now = getTime();
      var timespanMillis = now - this.timestamp;

      var total = this.totalAtTimestamp + this.rate * ( timespanMillis / 1000 );
      
      $(this.container).text(total.toFixed(2));
    }
  };

  global.Meetoring = global.Meetoring || {};
  Meetoring.Counter = Class;

})(window);