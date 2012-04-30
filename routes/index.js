var Meeting = require('../model/meeting');

var routes = {};

/*
 * GET home page or /:hash
 */
routes.index = function(req, res) {
  Meeting.find(req.params.hash, callback);
   
  function callback(meeting){
     if (!meeting)
        res.render('index', { title: 'Meetoring', layout:"layout" })
      else {
        res.render('meeting', { meeting: meeting.clientModel(), title: 'Meeting' })
      }
   } 
};  

/*
 * POST home page
 */
 
routes.createMeeting = function(req, res, next){
  var meetingName = req.body.meetingName;
  var meeting = new Meeting(meetingName);

  meeting.save(callback);
   
  function callback (saved) {
     if (saved) {
          console.log('Created /' + meeting._id);
          res.redirect('/' + meeting._id);    
      } else {
        res.render('index', { title: 'Meetoring' })
      }
   }
};

routes.joinMeeting = function(req, res, next) { 
  var rate = req.body.rate
    , clientId = req.body.clientId;
  
  rate = parseFloat(rate.replace(",", "."));
    
  Meeting.find(req.params.hash, function(meeting) {
    if (!meeting){
      res.send("Can't find that meeting", 404);
    }else {
      if( isNaN(rate) ) return res.json(meeting.clientModel());
                
      meeting.addAttendee(clientId,rate);
      res.json(meeting.clientModel());
    }
  });
}

routes.leaveMeeting = function(req, res, next) {
  var clientId = req.body.clientId;
  Meeting.find(req.params.hash, function (meeting) {
    if (!meeting)
      res.send("Can't find that meeting", 404);
    else {
      var rate = req.body.rate;
      meeting.removeAttendee(clientId, rate);
      res.json(meeting.clientModel());
    }
  });
}

module.exports = routes;

