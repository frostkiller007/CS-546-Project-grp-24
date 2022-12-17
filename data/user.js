const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user;
const {ObjectId} = require('mongodb');
const valid = require('../helper');
const bcrypt = require("bcrypt");
const { checkEmail } = require('../helper');
let saltRounds = 10;

const createUser = async(
    userName,
    email,
    age,
    city,
    state,
    posts,
    password
    ) => {
    userName = valid.checkUserName(userName);
    email = valid.checkEmail(email);
    age = valid.checkAge(age);
    city = valid.checkCity(city);
    // // // postID = valid.checkPostID(postID);
    password = valid.checkPassword(password);

    const usersCollection = await users();
    let userExist = await usersCollection.findOne({ username: userName });
    if (userExist) {
      throw { code: 400, err: "Username already exists" };
    }
    hashedPassword = await bcrypt.hash(password, saltRounds);
    
    let newUsers = {
        username: userName,
        email: email,
        age: age,
        city: city,
        state: state,
        posts: [],
        password: hashedPassword
    }
    
    const insertInfo = await usersCollection.insertOne(newUsers);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';  
    // const newId = insertInfo.insertedId.toString();
    // const user = await getUserById(newId);

    // return user;
    return { insertedUser: true };

};

const getUserById = async(userId) =>{
    userId = valid.checkString(userId,'userId')
    if(!ObjectId.isValid(userId)) throw 'The provided id not a valid objectID';

    const usersCollection = await users();
    const user = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(user === null) throw 'There is no user with the provided id';
    user._id = user._id.toString();
  
  return user;
};

const verifyUser = async (
    email, password
    ) => {
    email = valid.checkEmail(email,'email');
    password = valid.checkPassword(password,'password');
  
    let ret;
    const usersCollection = await users();
    const userExists = await usersCollection.findOne({ email: email});
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


const AddPosttoUser = async(userid, postid) => {
  const UserCollection = await users();
  const updatedInfo = await UserCollection.updateOne({_id: ObjectId(userid)}, {$addToSet: {posts: postid}});
  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) throw 'Could not add post to the user';
  return await this.getUserById(userid);
};

module.exports = {
    createUser,
    getUserById,
    verifyUser,
    AddPosttoUser
};