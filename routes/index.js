const express = require("express");
// https://expressjs.com/en/guide/routing.html#express-router
const router = express.Router();
const passport = require("passport");
router.get("/", (req, res) => {
    // renders the index.ejs page
    res.render("index", {
      // This gets rendered as the browsers title
      // it is passed into the ejs page as the variable 'title'
      title: "MeMED",
      user: req.user && {
        "id": req.user.id,
        "email": req.user.email, 
        "displayName": req.user.displayName
      }
    });
  });
////// User Sign up and login is explained roughly here
////// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
router.get("/login", function(req, res) {
  res.render("login", {
    title: "Login Page",
    layout: "login-layout",
    message: req.flash("loginMessage")
  });
});
router.post("/login", function(req, res, next, ...args) {
  return passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next, ...args);
});
router.get("/signup", function(req, res) {
  res.render("signup", {
    title: "Signup Page",
    layout: "login-layout",
    message: req.flash("signupMessage")
  });
});
router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/", // redirect to the secure profile section
    failureRedirect: "/signup", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })
);
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
module.exports = router;