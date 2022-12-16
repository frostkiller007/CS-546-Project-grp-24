const express = require("express");
const app = express();

const session = require("express-session");
const cookieParser = require("cookie-parser");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

// app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 864000000, // 10 days
    },
  })
);
//Authentication Middleware
app.use("/protected", (req, res, next) => {
  if (!req.session.login) {
    return res
      .status(403)
      .render("forbiddenAccess", { notLogged: true, title: `403: Forbidden` });
  }
  next();
});
//Logging Middleware
app.use((req, res, next) => {
  let timeStamp = new Date().toUTCString();
  let reqMethod = req.method;
  let reqRoute = req.originalUrl;
  if (req.session.login) {
    console.log(
      `[${timeStamp}]: ${reqMethod} ${reqRoute} (Authenticated User)`
    );
  } else {
    console.log(
      `[${timeStamp}]: ${reqMethod} ${reqRoute} (Non-Authenticated User)`
    );
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
