const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.user;
const { ObjectId } = require("mongodb");
const valid = require("../helper");
const bcrypt = require("bcrypt");
const { checkEmail } = require("../helper");
let saltRounds = 10;

const createUser = async (
  userName,
  email,
  age,
  city,
  state,
  // postID,
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
  let emailExist = await usersCollection.findOne({ email: email });
  if (emailExist) {
    throw { code: 400, err: "Email already exists" };
  }
  hashedPassword = await bcrypt.hash(password, saltRounds);

  let newUsers = {
    username: userName,
    email: email,
    age: age,
    city: city,
    state: state,
    // // postID: postID,
    password: hashedPassword,
  };

  const insertInfo = await usersCollection.insertOne(newUsers);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add user";
  // const newId = insertInfo.insertedId.toString();
  // const user = await getUserById(newId);

  // return user;
  return { insertedUser: true };
};

const getUserById = async (userId) => {
  userId = valid.checkString(userId, "userId");
  if (!ObjectId.isValid(userId)) throw "The provided id not a valid objectID";

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (user === null) throw "There is no user with the provided id";
  user._id = user._id.toString();

  return user;
};
const getUserByEmail = async (email) => {
  email = valid.checkEmail(email);

  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: email });
  if (user === null) throw "There is no user with the provided email";
  user.username = user.username.toString();

  return user.username;
};
const verifyUser = async (email, password) => {
  email = valid.checkEmail(email, "email");
  password = valid.checkPassword(password, "password");

  let ret;
  const usersCollection = await users();
  const userExists = await usersCollection.findOne({ email: email });
  try {
    if (userExists) {
      compareToDb = await bcrypt.compare(password, userExists.password);
      if (compareToDb) {
        ret = { authenticatedUser: true };
      } else {
        throw "Error: Either the username or password is invalid";
      }
    } else {
      throw "Error: Either the username or password is invalid";
    }
  } catch (e) {
    return false;
  }
  return ret;
};

const updateUsername = async (username, userID) => {
  username = valid.checkUserName(username);
  if(!userID) throw "Error: You must provide userID";

  const userCollection = await users();
  const updateInfo = await userCollection.updateOne({ _id: ObjectId(userID)},{$set: username});

  if(updateInfo.modifiedCount === 0) throw 'Error: username can not be updated';
  
  return username;
};


module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  verifyUser,
};
