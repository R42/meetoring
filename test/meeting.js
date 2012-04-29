var should = require('should')
  , Meeting = require('../model/meeting')

describe('Meeting', function(){
  
  var name = 'coolmeeting'
    , meeting = new Meeting(name)
  
  describe('#clientModel()', function(){
    it('should produce a clientModel', function(){
      var clientModel = meeting.clientModel()
      should.exist(clientModel)
      clientModel.name.should.equal(name);
      should.exist(clientModel.id)
      clientModel.should.have.property('rate')
      clientModel.should.have.property('total')
    })
  })
  
  describe('#getTotal()', function() {
    it('should provide the total', function() {
      meeting = new Meeting(name)
      meeting.getTotal().should.not.be.above(0)
      meeting.addAttendee(3600)
      setTimeout(function() {
        meeting.getTotal().should.be.above(0)
        meeting.getTotal().should.not.be.above(3)
      }, 1000)
    })
  })
})