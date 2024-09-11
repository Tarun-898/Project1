const express=require("express");
const router =express.Router();
const user=require("../models/user.js");
const wrapasync = require("../public/util/wrapasync.js");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware/isAuthenticate.js")
const userController=require("../controllers/user.js");

router
.route("/signup")
.get(userController.getSign)
.post(wrapasync(userController.signUp));


router
.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

router.get("/logout",userController.logout);

module.exports=router;