const list=require("../models/listing.js");

module.exports.index=(async (req,res)=>{
    const allList=await list.find({});
    console.log(allList);
    res.render("./lists/index.ejs",{allList});

});

module.exports.newRoute=(req,res)=>{
    res.render("./lists/new.ejs")
};

module.exports.showRoute=async (req,res)=>{
    let {id}=req.params;
    const listData= await list.findById(id).populate({path:"reviews",populate:{
        path:"author"}})
    .populate("owner");
    if(!listData){
        res.redirect("/lists");
        req.flash("error","Path does not exist");
    };
    console.log(listData);
    res.render("./lists/show.ejs",{listData});
};

module.exports.createRoute=async (req,res,next)=>{
    let url=req.file.path;// from cloud
    let filename=req.file.filename;//from cloud
    let {title,description,image,price,country,location}=req.body;
    const newList=new list({
        title:title,
        description:description,
        image:image,
        price:price,
        country:country,
        location:location
    });
    // if(!req.body.newList){
    //     throw new expressError(404,"Data not valid");
    // };
    console.log(newList);
    newList.owner=req.user._id;
    newList.image={url,filename};
    await newList.save();
    req.flash("success","New list created");
    res.redirect("lists");
};

module.exports.editRoute=async (req,res)=>{
    let {id}=req.params;
    const listData= await list.findById(id);
    if(!listData){
        req.flash("error","Path does not exist");
        res.redirect("/lists");
    }
    console.log(listData);
    res.render("./lists/edit.ejs",{listData});
};

module.exports.updateRoute=async (req,res)=>{
    let {id}=req.params;
    let listing=await list.findByIdAndUpdate(id,{...req.body});
    
    if(typeof req.file !=="undefined"){
    let url=req.file.path;// from cloud
    let filename=req.file.filename;
    listing.image={url,filename};
    
    };
    await listing.save();

    console.log("succesfuly update");
    req.flash("success","list Updated");
    res.redirect("/lists/" + id);
};

module.exports.deleteRoute=async (req,res)=>{
    let {id}=req.params;
    await list.findByIdAndDelete(id);
    req.flash("success","List Deleted");
    res.redirect("/lists");
};