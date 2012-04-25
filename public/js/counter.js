(function(){
  
  var STATE ={ 
    RUNNING: "running",
    STOPPED: "stopped"
  };
    
  var Class = function (container, period){
    this.total = 0;
    this.rate = 0;
    this.period = period || 1000;
    this.delay =  period + 30;
    this.interval;
    this.state = STATE.STOPPED;
    this.container = container;
  };
  
  Class.prototype = {
    
    init: function(meeting){
      this.total = parseFloat(meeting.total);
      this.rate = parseFloat(meeting.rate);
    },
  
    start: function(){
      if( this.state === STATE.RUNNING )
        return;
        
      this.state = STATE.RUNNING;

      var self = this;        
      var ticker = function() {
        self.increment();
        self.render();
      };
    
      this.interval = setInterval(ticker, this.delay);
    },

    increment: function(){
      this.total += this.rate * this.period / 1000;
    },

    stop: function(){
      if(this.state === STATE.STOPPED)
        return;
        
      this.state = STATE.STOPPED;
      clearInterval(this.interval);
    },
  
    restart: function(meeting){
      this.stop();
      this.init(meeting);
      this.start();
    },
  
    render: function(){
      $(this.container).text(this.total.toFixed(2));
    }
  };

  window.Meetoring.Counter = Class;
  
})(window);