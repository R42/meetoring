(function(global){
  
  function ticker(self) {
    self.total += self.rate * self.delay / 1000;
    self.render();
  }

  var Class = function (container, delay, duck){
    this.container = container;
    this.delay =   delay;
    this.total = this.rate = 0;
    this.interval = null;
    this.sync(duck);
  };

  Class.prototype = {
    sync: function(duck){
      this.total = parseFloat(duck.total);
      this.rate = parseFloat(duck.rate);
      var self = this;

      if (this.rate != 0 && this.interval == null) {
        this.interval = setInterval(function() { ticker(self); }, this.delay + 30);
      } else if (this.rate == 0 && this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    
    render: function() {
      $(this.container).text(this.total.toFixed(2));
    }
  };

  global.Meetoring = global.Meetoring || {};
  Meetoring.Counter = Class;

})(window);