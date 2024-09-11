const Review=require("../models/review.js");
const list=require("../models/listing.js");

module.exports.newReview=async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const data = await list.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    await newReview.save(); 
    data.reviews.push(newReview); 
    await data.save(); 
    req.flash("success","New review created");
    res.redirect("/lists/"+id); 
  };

  module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    console.log(id,reviewId);
    await list.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect("/lists/"+id);
  };