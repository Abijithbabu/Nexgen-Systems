const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");
const nocache = require("nocache");
const express = require("express");
const app = express();
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache());
app.use(express.static('public'))
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use('*', (req, res)=>res.render('users/404.ejs'))
app.listen(3000, function () {
  console.log("server is running at 3000");
}); 
