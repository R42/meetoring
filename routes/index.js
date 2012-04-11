
/*
 * GET home page or /:hash
 */
module.exports.index = exports.index = function(req, res) {
  req.app.session.get(req.params.hash, function(meeting){
    if (!meeting)
      res.render('index', { title: 'Meetoring' })
    else
      res.render('meeting', { meeting: meeting, title: 'Meeting' });
  });
};  
