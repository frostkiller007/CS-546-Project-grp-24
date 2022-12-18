const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.user;
const { ObjectId } = require("mongodb");
const valid = require("../helper");
const bcrypt = require("bcrypt");
const { checkEmail } = require("../helper");
const helper = require("../helper");
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
  // posts = helper.arraycheck(posts);
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
    // posts: [],
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

const getUserByUsername = async (username) => {
  username = valid.checkUserName(username, "username");

  const usersCollection = await users();
  const user = await usersCollection.findOne({ username: username });
  if (user === null) throw "There is no user with the provided username";

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
        ret = { id: userExists._id.toString(), authenticatedUser: true };
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
  if (!userID) throw "Error: You must provide userID";
  if (!ObjectId.isValid(userID))
    throw "The provided userID not a valid objectID";

  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $set: { username: username } }
  );

  if (updateInfo.modifiedCount === 0)
    throw "Error: username can not be updated";

  return username;
};

const updateState = async (state, userID) => {
  state = valid.checkString(state);
  if (!userID) throw "Error: You must provide userID";
  if (!ObjectId.isValid(userID))
    throw "The provided userID not a valid objectID";

  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $set: { state: state } }
  );

  if (updateInfo.modifiedCount === 0) throw "Error: state can not be updated";

  return state;
};

const updateCity = async (city, userID) => {
  city = valid.checkString(city);
  if (!userID) throw "Error: You must provide userID";
  if (!ObjectId.isValid(userID))
    throw "The provided userID not a valid objectID";

  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $set: { city: city } }
  );

  if (updateInfo.modifiedCount === 0) throw "Error: city can not be updated";

  return state;
};

const updatePassword = async (password, userID) => {
  if (!password) throw "Error: Must provide password";
  if (typeof password !== "string")
    throw "Error: password must be of type string";
  if (!userID) throw "Error: You must provide userID";
  if (!ObjectId.isValid(userID))
    throw "Error: The provided userID not a valid objectID";
  hashedPassword = await bcrypt.hash(password, saltRounds);
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: ObjectId(userID) },
    { $set: { password: password } }
  );

  if (updateInfo.modifiedCount === 0)
    throw "Error: password can not be updated";

  return state;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
  verifyUser,
  updateUsername,
  updatePassword,
  updateCity,
  updateState,
};
