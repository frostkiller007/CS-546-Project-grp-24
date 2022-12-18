const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
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
app.use("/mainPage", (req, res, next) => {
  if (!req.session.login) {
    return res.status(403).render("mainPage/home", {
      notLogged: true,
      title: `Main Page (not logged)`,
    }); // not loggedin page
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
app.use("/profile/update", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/private");
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    req.method = "PATCH";
    next();
  }
});
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
//===========================================================================
// Admin user
// {
//   "username":"Admin",
//   "email":"Admin214@gmail.com",
//   "age":"35",
//   "city":"Hoboken",
//   "state":"NJ",
//   "password":"1Admin214@gmail.com"
//  }
