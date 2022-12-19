const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require("multer");
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
// app.use("/mainPage", (req, res, next) => {
//   if (!req.session.login) {
//     return res.render("mainPage/home", {
//       notLogged: true,
//       title: `Main Page (not logged)`,
//     }); // not loggedin page
//   }
//   next();
// });
//-------Multer Middleware for Image Upload---------//

app.use("/profile-upload-single", (req, res, next) => {
  if (req.method == "GET") {
    return res.status(403).render("httpErrors/error", {
      layout: "errorPage",
      code: 403,
      description: "Forbidden",
      title: "403: Forbidden",
    });
  }
  next();
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(" ").join("-"));
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      let error = "Error";
      return error;
    }
  },
});

app.post(
  "/profile-upload-single",
  (result = upload.single("profile-file")),
  async function (req, res, next) {
    try {
      if (result === "Error") {
        throw "Only .png, .jpg and .jpeg format supproted!";
      }
      profilePicture = req.file.originalname;
      const updateProfilePicture = await updatePicture.updatePicture(
        req.session.user.id,
        profilePicture
      );
      req.session.user.profilePicture = profilePicture;
      return res.redirect("/profile");
    } catch (error) {
      console.log(error);
      res.status(401).redirect("/profile");
      return;
    }
  }
);
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
//USER COOKIE
// Session {
//   cookie: {
//     path: '/',
//     _expires: 2022-12-28T23:38:48.205Z,
//     originalMaxAge: 864000000,
//     httpOnly: true
//   },
//   AuthCookie: 'Acv@bn.com',
//   user: {
//     email: 'Acv@bn.com',
//     username: 'Acvbn',
//     id: '639dd3ea2e0226d60b5bf02e',
//     isAdmin: false
//   },
//   login: true
// }
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
