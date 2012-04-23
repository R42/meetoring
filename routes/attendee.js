module.exports.model = model;

function model(){
  return Attendee;
}


function Attendee(properties){
  properties = properties || {};
  for(var x in properties){
    this[x]=properties[x];
  }
}
