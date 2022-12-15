const userRoutes = require("./user");
const postRoutes = require("./post");
const chatRoutes = require("./chats");
const commentRoutes = require("./comment");
const mainPageRoutes = require("./mainPage");
const reportRoutes = require("./report");

const constructorMethod = (app) => {
  app.use("/mainPage", mainPageRoutes);
  app.use("/user", userRoutes);
  app.use("/post", postRoutes);
  app.use("/chat", chatRoutes);
  app.use("/report", reportRoutes);
  app.use("/comment", commentRoutes);

  app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/mainPage");
  });
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
