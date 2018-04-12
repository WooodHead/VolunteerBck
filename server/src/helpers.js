export function validateEmail (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export function validatePassword (password) {
  //At least 1 letter
  var letter = /^(?=.*?[a-z])/;
  //At least 1 special char
  var specialChar = /^(?=.*[!@#$%^&*])/;
  //At Least 8 CHaracters
  var fiveCharacters = /^.{5,}$/;

  //Validation
  if (!letter.test(String(password)) || !fiveCharacters.test(String(password))) {
    return 'Password should have a letter and be at least 5 characters long';
  }
  if (!specialChar.test(String(password))) {
    return 'Password should contain a special character';
  }
  return 'Valid';
}
