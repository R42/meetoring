var Meeting = require('../model/meeting');

/*
 * GET home page or /:hash
 */
function index(req, res) {
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
 
function createMeeting(req, res, next){
  debugger
  
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

function joinMeeting(req, res, next) {
  var rate = req.body.rate;
  rate = parseFloat(rate.replace(",", "."));
  
  Meeting.find(req.params.hash, callback);
  
  function callback(meeting) {
    if (!meeting)
      res.send("Can't find that meeting", 404);
    else {
      meeting.addAttendee(rate);
      res.json(meeting.clientModel());
    }
  }
}

function leaveMeeting(req, res, next) {
  Meeting.find(req.params.hash, callback);
  
  function callback(meeting) {
    if (!meeting)
      res.send("Can't find that meeting", 404);
    else {
      var rate = req.body.rate;
      meeting.removeAttendee(rate);
      res.json(meeting.clientModel());
    }
  }
}

module.exports.handlers = { index: index, createMeeting: createMeeting, joinMeeting: joinMeeting }

