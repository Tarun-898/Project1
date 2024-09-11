const mongoose=require("mongoose");
const initData=require("./data.js");
const list=require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to DB");
}).catch((err) =>{ 
    console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB=async ()=>{
    await list.deleteMany({});
    const datainit=initData.data.map((obj)=>({...obj,owner:"66dc1e24591e96c09af25969"}));
    await list.insertMany(datainit);
    console.log("data initialized");
};
initDB();