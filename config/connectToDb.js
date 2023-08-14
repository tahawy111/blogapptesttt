const mongoose=require("mongoose")

module.exports=async()=>{
  try {
    await mongoose.connect(process.env.MONGO_CLOUD_URL)
    console.log("connected");
    
  } catch (err) {
    console.log("Connection failed to mongodb" , err);
  }
}