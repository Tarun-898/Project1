if(process.env.NODE_ENV!="production"){
    require("dotenv").config();//env for secret Api keys and values
}
// console.log(process.env.SECRET);//access in ENV(envirmental variable)
const express=require("express");
const app=express();
const mongoose = require('mongoose');
const list=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./public/util/wrapasync.js");
const expressError=require("./public/util/expresserror.js");
const {listSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");

const lists=require("./routes/list.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl=process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("connected to DB");
}).catch((err) =>{ 
    console.log(err)});

async function main() {
    await mongoose.connect(dbUrl);
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};




app.use((err,req,res,next)=>{
    let{statusCode=404,message="Page not found"}=err;
    res.status(statusCode).send(message);
});

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    },
};

// app.get("/",(req,res)=>{
//     console.log("hii there");
//     res.send("hii there");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



app.listen(8080,()=>{
    console.log("app listen");
});

app.use("/lists",lists);
app.use("/lists/:id/reviews",reviews);
app.use("/",userRouter);

app.all("*",(req , res,next)=>{
    next(new expressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"}= err;
    res.status(statusCode).send(message);
});