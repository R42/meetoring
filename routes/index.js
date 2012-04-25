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
      }else{
        res.render('index', { title: 'Meetoring' })
      }
   }//CALLBACK
}; 

module.exports = routes;

