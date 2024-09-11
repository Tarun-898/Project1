const list=require("../models/listing.js");
const review=require("../models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//save the path of user which want to access before login like add like , add comment on a particular list.
        req.flash("error","Login to Access");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;//save in local variable to access in another files.
    };
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listda=await list.findById(id);
    if(!listda.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have access");
        return res.redirect("/lists/"+id);
    };
    next();
};

//for review
module.exports.isRowner=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let reviewda=await review.findById(reviewId);
    if(!reviewda.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have access");
        return res.redirect("/lists/"+id);
    };
    next();
};