//ValidateEmailRegex
export function validateEmail (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//ValidatePwd Regex
export function validatePassword (password) {
  //At least 1 letter
  const letter = /^(?=.*?[a-z])/;
  //At least 1 special char
  const specialChar = /^(?=.*[!@#$%^&*])/;
  //At Least 8 CHaracters
  const fiveCharacters = /^.{5,}$/;

  //Validation
  if (!letter.test(String(password)) || !fiveCharacters.test(String(password))) {
    return 'Password should have a letter and be at least 5 characters long';
  }
  if (!specialChar.test(String(password))) {
    return 'Password should contain a special character';
  }
  return 'Valid';
}

//ObjectId translator
export const prepare = (o) => {
  o._id = o._id.toString()
  return o
}
