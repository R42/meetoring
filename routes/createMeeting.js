var crc32 = require('../crc32');

/*
 * POST home page
 */
module.exports.createMeeting = function(req, res, next){

  var name = req.body.meeting_name;

  if (!name) 
    res.render('index', { title: 'Meetoring' })

  var hash = crc32(name);

  console.log('entered create meeting');

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
  
    res.redirect('/'+hash);
  });
}; 
