require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
app.set('view engine', 'ejs');

//const cookieParser = require("cookie-parser");
const session = require("express-session");
//const passport = require("Passport");

//app.use(cookieParser());
app.use(session({
    secret: 'yuvrajsinghjat',
    resave: false,
    saveUninitialized: true
  }));

  let flash = require('connect-flash');
  app.use(flash());
const { database } = require('./database/sql.database.js');
const { userRouter } = require('./routes/user.routes.js');
const { adminRouter } = require('./routes/admin.route.js');
const { user1Router } = require('./routes/user1.route.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,"public")));


const port = 8080;
database()
.then(()=>{
    console.log("Database in index folder");
})
.catch((error)=>{
    console.log("Database error in index folder",error);
});

app.listen(port ,()=>{
    console.log(`App is listening on ${port}`);
    console.log(`http://localhost:${port}`);
})

app.get("/",(req,res)=>{
    res.locals.failure = req.flash("failure");
    res.locals.passwordNotMatch = req.flash("passwordNotMatch");
    res.render("user/home.ejs");
});

//app.use("/users",userRouter);
app.use("/users",user1Router);
app.use("/admin",adminRouter);

