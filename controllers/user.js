const user=require("../models/user.js");

module.exports.getSign=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newUser=new user({email,username});
    const registerUser=await user.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        };
        req.flash("success", "New User Register");
    res.redirect("/lists");
    });
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    };
    
};

module.exports.getLogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/lists";
    res.redirect(redirectUrl);//same path befor login want to access(from is Authentication).
};

module.exports.logout=(req,res,next)=>{
    req.logout((error)=>{
        if(error){
            return next(error);
        };
        req.flash("success","logout Successful")
        res.redirect("/lists");
    });
};