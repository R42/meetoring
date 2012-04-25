!function(){
    
  var Class = function (_delay, container){
    this.total = 0;
    this.rate = 0;
    this.delay =  ( _delay && _delay * 1030 ) || 1030;
    this.interval;
    this.state = "stopped";
    this.container = container;
  };
  
  Class.prototype = {
    
    init: function(meeting){
      this.total = parseFloat(meeting.total);
      this.rate = parseFloat(meeting.rate);
    },
  
    this.start: function(){
      if( this.state == "running")
        return;
        
      this.state = "running";

      var self = this;        
      var ticker: function() {
        self.increment();
        self.render();
      };
    
      this.interval = setInterval(ticker, this.delay);
    },

    this.increment: function(){
      this.total += this.rate;
    },

    this.stop: function(){
      if(this.state === "stopped")
        return;
        
      this.state = "stopped";
      this.total = 0;
      this.rate = 0;
      
      clearInterval(this.interval);
    },
  
    this.restart: function(meeting){
      this.stop();
      this.init(meeting);
      this.start();
    },
  
    this.render: function(){
      $(this.container).text(this.total.toFixed(2));
    }
  };
  
  Meetoring.Counter = Class;
};