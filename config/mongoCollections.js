const dbConnection = require("./mongoConnection");
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};
module.exports = {
  // DATABASE COLLECTIONS
  user: getCollectionFn("user"),
  post: getCollectionFn("post"),
  comment: getCollectionFn("comment"),
  chat: getCollectionFn("chat"),
  report: getCollectionFn("report"),
};
