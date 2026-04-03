const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";  // db se cooncect nd db name is -> wanderlust

main().then(()=>{
    console.log(`Connect with DB`);
}).catch((err)=>{
    console.log(err);
})

async function main(params) {
    await mongoose.connect(MONGO_URL);
}
const initDB =  async () =>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj, owner: '69c67423a9883114c5d85641'}));  // object id
   await Listing.insertMany(initData.data);
   console.log(`data was Initialized`);
};
initDB();