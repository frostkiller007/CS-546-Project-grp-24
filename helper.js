const { ObjectId } = require("mongodb");
const offensive = require("bad-words");
const check = new offensive();

module.exports = {
  checkUserName(userName) {
    if (!userName) throw "You must provide userName";
    if (typeof userName !== "string") throw "userName must be a string";
    userName = userName.trim();
    if (userName.length === 0)
      throw "userName cannot be an empty string or just spaces";
    if (userName.length < 4)
      throw "userName must be at least 4 characters long";
    let regex = /^[A-Za-z0-9]*$/;
    if (!regex.test(userName))
      throw "userName must be only alphanumeric characters and no spaces";

    return userName.toLowerCase();
  },

  checkEmail(email) {
    if (!email) throw "You must provide email";
    if (typeof email !== "string") throw "email must be a string";
    email = email.trim();
    if (email.length === 0)
      throw "email cannot be an empty string or just spaces";
    //(name)@(domain).(extension)(.extension)
    //let regex = /^([A-Za-z0-9_-\.]+)@([a-zA-Z0-9]+).([a-z]{2,10})(.[a-z]{2,10})?$/;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(email)) throw "email not valid";

    return email.toLowerCase();
  },

  checkAge(age) {
    if (!age) throw "You must provide age";
    age = Number(age);
    if (typeof age !== "number") throw "age must be a number";
    if (!(age % 1 === 0)) throw "Age must be a whole number";
    // 1-15 under age, 16-100 valid age
    if (age < 16) throw "You must be above 16Y";
    if (age > 100) throw "You must be between 16-100 years";

    return age;
  },

  checkCity(city) {
    if (!city) throw "You must provide city";
    if (typeof city !== "string") throw "city must be a string";
    city = city.trim();
    if (city.length === 0)
      throw "city cannot be an empty string or just spaces";
    //TODO: city specific error handling
    return city;
  },

  checkPostID(postId) {
    if (!postId) throw "You must provide postId";
    if (!Array.isArray(postId)) throw "postId must be an array of objects";
    postId.forEach((ele) => {
      ele = ele.trim();
      if (typeof ele !== "object")
        throw "each element in postId must be an object";
    });

    return postId;
  },

  checkPassword(password) {
    if (!password) throw "You must provide password";
    if (typeof password !== "string") throw "password must be a string";
    if (password.trim().length === 0)
      throw "password cannot be an empty string or just spaces";
    if (password.length < 6)
      throw "password must be at least 6 characters long";
    let regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[^0-9])(?=.*[!@#$%^&*]).{6,}$/;
    if (!regex.test(password))
      throw "password must contain at least one uppercase character, one number and one special character";

    return password;
  },

  checkString(value, valueName) {
    if (!value) throw `You must provide ${valueName}`;
    if (typeof value !== "string") throw `${valueName} must be a string`;
    value = value.trim();
    if (value.length === 0)
      throw `${valueName} cannot be an empty string or just spaces`;

    return value;
  },

  checkPostID(postID) {
    //TODO: NO POSTS
    if (!postID) throw "You must provide userName";
    if (typeof userName !== "string") throw "userName must be a string";
    userName = userName.trim();
    if (userName.length === 0)
      throw "userName cannot be an empty string or just spaces";

    return value;
  },
  // HELPER FUNCTION FOR ID CHECKING:
  idcheck(id) {
    if (!id) throw "Please provide an id to search for";
    if (typeof id !== "string") throw "id has to be a string";
    if (id.trim().length === 0)
      throw "id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
  },

  //HELPER FUNCTION FOR VALID STRING INPUT
  // USE THIS FUNCTION FOR CHECKING CONTENTS LIKE POST_CAPYION OR COMMENT ETC.
  contentcheck(content) {
    if (!content) throw "Please provide a content";
    if (typeof content !== "string") throw "content has to be a string";
    if (content.trim().length === 0)
      throw "content cannot be an empty string or just spaces";
    content = content.trim();
    content = check.clean(content);
  },
  // HELPER FUNCTION FOR ARRAY CHECKING:
  arraycheck(array) {
    if (!array) throw "Please provide an array";
    if (!Array.isArray(array)) throw `${array} has to be an array`;
    array.forEach((element) => {
      if (typeof element !== "string")
        throw "array elements have to be a string";
    });
  },
};
