const userRoutes = require("./user");
const postRoutes = require("./post");
const chatRoutes = require("./chats");
const commentRoutes = require("./comment");
const homepageRoutes = require("./homepage");
const reportRoutes = require("./report");

const constructorMethod = (app) => {
  app.use("/homepage", homepageRoutes);
  app.use("/user", userRoutes);
  app.use("/post", postRoutes);
  app.use("/chat", chatRoutes);
  app.use("/report", reportRoutes);
  app.use("/comment", commentRoutes);

  app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/homepage");
  });
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
