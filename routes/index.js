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

  var meeting_name = req.body.meeting_name;
  
  var meeting = new Meeting(meeting_name);
  meeting.save(callback);
   
  function callback (saved) {
     if (saved) {
          res.redirect('/' + meeting._id);    
      }else{
        res.render('index', { title: 'Meetoring' })
      }
   }//CALLBACK
}; 

routes.joinMeeting = function(req, res, next) {
  var rate = req.body.rate;
  var clientId = req.body.clientId;
  
  rate = parseFloat(rate.replace(",", "."));
  
  Meeting.find(req.params.hash, function(meeting) {
    if (!meeting)
      res.send("Can't find that meeting", 404);
    else {
      meeting.addAttendee(clientId,rate);
      res.json(meeting.clientModel());
    }
  });
}

routes.leaveMeeting = function(req, res, next) {
  Meeting.find(req.params.hash, function (meeting) {
    if (!meeting)
      res.send("Can't find that meeting", 404);
    else {
      var rate = req.body.rate;
      meeting.removeAttendee(rate);
      res.json(meeting.clientModel());
    }
  });
}

routes["model"] = Meeting;
module.exports = routes ;

