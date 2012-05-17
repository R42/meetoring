function setupHandlers(app) {

  var util = require('util');

  var Meeting = require('./meeting');
  var setupRealtime = require('./realtime');
  
  var config = app.get('config');

  var meetings = {};

  app.get('/' , function(req, res, next) {
    res.render('home');
  });

  app.get('/:meetingId' , function(req, res, next) {
    var id = req.params.meetingId;
    if (!meetings.hasOwnProperty(id)) {
      next();
      return;
    }

    res.render('meeting', { meeting: meetings[id].clientModel() })
  });

  app.post('/', function(req, res, next){

    var meeting = new Meeting(req.body.meetingName);
    meetings[meeting.id] = meeting;

    setupRealtime(app, meeting);

    res.redirect(util.format('%s/%s', config.shorterDomain, meeting.id));
  });
}

module.exports = setupHandlers;