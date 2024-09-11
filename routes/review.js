const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../public/util/wrapasync.js");
const expressError=require("../public/util/expresserror.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const list=require("../models/listing.js");
const {isLoggedIn,isRowner}=require("../middleware/isAuthenticate.js");
const reviewController=require("../controllers/review.js");


const validateReview=(req,res,next)=>{
  console.log(req.body);
  let {error}=reviewSchema.validate(req.body.review);
  if(error){
        let errMsg =error.details.map((el)=>el.message).join(",")
        throw new expressError(400,error)
  }
  else{
        next();
  }
};


//new review
router.post("/",validateReview,isLoggedIn,reviewController.newReview);

  //delete review
  router.delete("/:reviewId",isLoggedIn,isRowner,wrapAsync(reviewController.deleteReview));

  module.exports=router;