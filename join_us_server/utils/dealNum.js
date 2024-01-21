exports.dealEmail = (email)=> {
  if (String(email).indexOf('@') > 0) {
    var str = email.split('@');
    var _s = '';
    var new_email = "";
    if (str[0].length > 3) { 
      for (var i = 3; i < str[0].length; i++) {
        _s += '*';
      }
      new_email = str[0].substr(0, 3) + _s + '@' + str[1];
    } else {
      for (var i = 1; i < str[0].length; i++) {
        _s += '*'
      }
      new_email = str[0].substr(0, 1) + _s + '@' + str[1]
    }
  }
  return new_email;
}



exports.dealPhoneNumber = (phone)=>{
  return phone.replace(phone.substring(3,8), "*****")
}