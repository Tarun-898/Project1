const express=require("express");
const router=express.Router();
const wrapAsync=require("../public/util/wrapasync.js");
const {listSchema}=require("../schema.js");
const expressError=require("../public/util/expresserror.js");
const list=require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware/isAuthenticate.js");
const listController=require("../controllers/list.js");
const multer=require("multer"); //multer for read upload image(multipart/form-data).
const {storage}=require("../clodConfig.js");
const upload=multer({storage});


const validateList=(req,res,next)=>{
    let {error}=listSchema.validate(req.body);
    if(error){
        next(new expressError(400,error.message));
    }else{
        next();
    }
};

//index route and create route
router
.route("/")
.get(wrapAsync(listController.index))
.post(
    isLoggedIn,
    upload.single("list[image]"),
    validateList,
    wrapAsync (listController.createRoute));

//new route
router.get("/new",isLoggedIn,listController.newRoute);

//show route and edit route and delete route
router.route("/:id")
.get(wrapAsync(listController.showRoute))
.put(isLoggedIn,isOwner,upload.single("list[image]"),wrapAsync(listController.updateRoute))
.delete(isLoggedIn,isOwner,wrapAsync(listController.deleteRoute));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listController.editRoute));

module.exports=router;