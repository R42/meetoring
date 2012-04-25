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
          console.log('Created /' + meeting._id);
          res.redirect('/' + meeting._id);    
      }else{
        res.render('index', { title: 'Meetoring' })
      }
   }//CALLBACK
}; 

module.exports = routes;

