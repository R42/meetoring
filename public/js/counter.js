(function(global){
  
  var STATE ={ 
    RUNNING: "running",
    STOPPED: "stopped"
  };
  
  var $ = window.$;
    
  var Class = function (container, period, syncTime){
    this.total = 0;
    this.rate = 0;
    this.period = period || 1000;
    this.delay =  period + 30;
    this.interval;
    this.state = STATE.STOPPED;
    this.container = container;
    this.syncTime = syncTime || 15000 ;
    this.syncronizer = null; 
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
      
      function syncronizer(){
        self.sync();
      }
    
      this.interval     = setInterval(ticker, this.delay);
      this.syncronizer  = setInterval(syncronizer ,this.syncTime);
    },

    increment: function(){
      this.total += this.rate * this.period / 1000;
    },

    stop: function(){
      if(this.state === STATE.STOPPED)
        return;
        
      this.state = STATE.STOPPED;
      clearInterval(this.interval);
      clearInterval(this.syncronizer);
    },
  
    restart: function(meeting){
      this.stop();
      this.init(meeting);
      this.start();
    },
  
    render: function(){
      $(this.container).text(this.total.toFixed(2));
    },
    
    sync: function(){
      $(document).trigger("socket:sync");
    }
    
  };

  window.Meetoring.Counter = Class;
  
})(window);