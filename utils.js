var characterScope = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSTUVWXYZ0123456789';

exports.randomAlphaNumeric = function(length){
  var result = '';
  for(var i = 0; i < length; i++) {
    result += characterScope.charAt(Math.floor((Math.random() * characterScope.length)));
  }
  return result;
};
