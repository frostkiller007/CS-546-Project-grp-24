const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId, Collection} = require('mongodb');
const valid = require('../helper');

const createUser = async(
    userName,
    email,
    age,
    city,
    state,
    postID,
    password,
    profilePicture
    ) => {
    userName = valid.checkUserName(userName);
    email = valid.checkEmail(email);
    age = valid.checkAge(age);
    city = valid.checkCity(city);
    postID = valid.checkPostID(postID);
    password = valid.checkPassword(password);
    if(profilePicture){
        valid.checkString(profilePicture,'Profile Photo');
    }

    if(userName.trim().length === 0) throw 'Username entered is an empty string';
    if(userName.length < 4) throw 'Username must be at least 4 characters long';
    let regex = /^[A-Za-z0-9]*$/;
    if(!regex.test(userName)) throw 'Username must be only alphanumeric characters and no spaces';

    const usersCollection = await users();
    let newUsers = {
        userName: userName,
        email: email,
        age: age,
        city: city,
        state: state,
        postID: postID,
        password: password,
        profilePicture: profilePicture

    }
    
    const insertInfo = await usersCollection.insertOne(newUsers);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';  
    const newId = insertInfo.insertedId.toString();
    const user = await getUserById(newId);

    return user;
}

const getUserById = async(userId) =>{
    userId = valid.checkString(userId,'userId')
    if(!ObjectId.isValid(userId)) throw 'The provided id not a valid objectID';

    const usersCollection = await users();
    const user = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(user === null) throw 'There is no user with the provided id';
    user._id = user._id.toString();
  
  return user;
}

const verifyUser = async (
    username, password
    ) => {
  
    username = username.toLowerCase();
    username = checkUsername(username,'username');
    password = checkPassword(password,'password');
  
    let ret;
    const usersCollection = await users();
    const userExists = await usersCollection.findOne({ username: username});
    try{
      if(userExists){
        compareToDb = await bcrypt.compare(password, userExists.password);
        if(compareToDb){
          ret = {authenticatedUser: true};
        }else{
          throw 'Error: Either the username or password is invalid';
        }
        
      } else{
        throw 'Error: Either the username or password is invalid';
      }
    }catch(e){
      return false;
    }
    return ret;
   };
module.exports = {
    createUser,
    getUserById
  };