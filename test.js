var crypto = require('crypto');



var hash4 = function(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  return shasum.digest('hex');
};

console.log(hash4('igor'));
console.log(hash4('igor'));
