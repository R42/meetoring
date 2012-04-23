
/*
 * GET home page or /:hash
 */
module.exports.index = exports.index = function(req, res) {
  req.app.session.get(req.params.hash, function(meeting){
    if (!meeting)
      res.render('index', { title: 'Meetoring' })
    else {
      res.render('meeting', { meeting: meeting, title: 'Meeting' })
    }
  });
};  


var crc32 = require('../crc32');

/*
 * POST home page
 */
module.exports.createMeeting = exports.createMeeting = function(req, res, next){

  var name = req.body.meetingName;
  
  if (!name) 
    res.render('index', { title: 'Meetoring' })

  var hash = crc32(name);

  req.app.session.get(hash, function(meeting) {
  
    if (meeting) {
      console.log('meeting already exists');
          // TODO: flash some warning back to the same page    
      return;
    }
  
    meeting = {
      name: name,
      attendees: [],
      totalCost: 0
    };

    req.app.session.set(hash, meeting); 
  
    console.log('redirecting to: ' + hash)
    res.redirect('/'+hash);
  });
}; 
