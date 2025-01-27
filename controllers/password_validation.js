function passwordValidation(arg) {
    /* THIS PART CHECK PART BY PART */
  
    let lowerCaseValidation = false;
    let upperCaseValidation = false;
    let numbersValidation = false;
    let specialCharValidation = false;
    let notSpaceValidation = false;
    let lengthValidation = false;
  
    let lowerCaseLetters = /[a-z]/g;
    if (arg.match(lowerCaseLetters)) {
      lowerCaseValidation = true;
    } else {
      lowerCaseValidation = false;
    }
  
    let upperCaseLetters = /[A-Z]/g;
    if (arg.match(upperCaseLetters)) {
      upperCaseValidation = true;
    } else {
      upperCaseValidation = false;
    }
  
    let numbers = /[0-9]/g;
    if (arg.match(numbers)) {
      numbersValidation = true;
    } else {
      numbersValidation = false;
    }
  
    let specialChar = /[*@!#%&()^~{}.+]/g;
    if (arg.match(specialChar)) {
      specialCharValidation = true;
    } else {
      specialCharValidation = false;
    }
  
    let spaceNotAllowed = /^\S+$/;
    if (arg.match(spaceNotAllowed)) {
      notSpaceValidation = true;
    } else {
      notSpaceValidation = false;
    }
  
    if (arg.length >= 8) {
      lengthValidation = true;
    } else {
      lengthValidation = false;
    }
  
   
    let finalValidation = false;
    switch (lowerCaseValidation) {
      case false:
        break;
      default:
        switch (upperCaseValidation) {
          case false:
            break;
          default:
            switch (numbersValidation) {
              case false:
                break;
              default:
                switch (specialCharValidation) {
                  case false:
                    break;
                  default:
                    switch (notSpaceValidation) {
                      case false:
                        break;
                      default:
                        switch (lengthValidation) {
                          case false:
                            break;
                          default:
                            finalValidation = true;
                        }
                    }
                }
            }
        }
    }
  
    return  finalValidation ;
}  

module.exports =  passwordValidation;