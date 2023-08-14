const asyncHandler=require("express-async-handler")
const {User, validateUpdateUser}=require("../models/User")
const bcrypt=require("bcryptjs")
const path=require("path")
const fs=require("fs")
const {cloudinaryUploadImage, cloudinaryRemoveImage , cloudinaryRemoveMultipleImage}=require("../utils/cloudinary")
const {Comment}=require("../models/Comment")
const {Post}=require("../models/Post")
 

// get all users
// api/users/profile
module.exports.getAllUsersCtrl=asyncHandler(async(req,res)=>{
    // select -password : to get all proprties except password
  const users=await User.find().select("-password")
  res.status(200).json(users)
})


// get signle user
// /api/users/profile/:id
module.exports.getUserProfileCtrl=asyncHandler(async(req,res)=>{
  // select -password : to get all proprties except password
  const user=await User.findById(req.params.id).select("-password").populate("posts");
  if(!user){
      res.status(404).json({message:"user not found"})
  }
  res.status(200).json(user)
})


// update user profile
module.exports.updateUserProfileCtrl=asyncHandler(async(req,res)=>{
  const {error}=validateUpdateUser(req.body)
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  if(req.body.password){
    const salt=await bcrypt.genSalt(10)
    req.body.password=await bcrypt.hash(req.body.password , salt)
  }
  const updateUser=await User.findByIdAndUpdate(req.params.id , {
    $set:{
      username:req.body.username,
      password:req.body.password,
      bio:req.body.bio,
    }
  },  {new:true}).select("-password").populate("posts")
  res.status(200).json(updateUser)
})


// get users count
// api/users/count
module.exports.getUsersCountCtrl=asyncHandler(async(req,res)=>{
  // select -password : to get all proprties except password
const count=await User.count()
res.status(200).json(count)
})


// Profile photo upload 
// api/users/profile/profile-photo-upload

module.exports.profilePhotoUploadCtrl=asyncHandler(async(req,res)=>{
  if(!req.file){
    res.status(400).json({message:"no file provided"})
  }
  // upload image to cloudinary
  const imagePath=path.join(__dirname,`../images/${req.file.filename}`)
  const result=await cloudinaryUploadImage(imagePath)
console.log(result)
const user=await User.findById(req.user.id)
// delete photo from cloudinary
if(user.profilePhoto.publicId !==null){
  await cloudinaryRemoveImage(user.profilePhoto.publicId)
}
// change profile photo in DB
user.profilePhoto={
  url:result.secure_url,
  publicId:result.public_id
}
//  save database
await user.save()
// response to client
  res.status(200).json({
    message:'photo uplaoded',
    profilePhoto:{url:result.secure_url , publicId:result.public_id}
  })
  // delete image from server
  fs.unlinkSync(imagePath)
})

// api/users/profile/:id
// method Delete
// accedd admin or user himself

module.exports.deleteUserProfileCtrl=asyncHandler(async(req,res)=>{
  // get user from DB
  const user=await User.findById(req.params.id)
  if(!user){
    res.status(404).json({message:"user not found"})
  }
  
  // get all posts from DB
  const posts=await Post.find({user:user._id})
  const publicIds=posts?.map((post)=>post.image.publicId)
  if(publicIds?.length > 0){
    await cloudinaryRemoveMultipleImage(publicIds)
  }

  // remove user profile picture
  if(user.profilePhoto.publicId != null){
    await cloudinaryRemoveImage(user.profilePhoto.publicId)

  }
  // delete user posts and comments
  await Post.deleteMany({
    user:user._id
  })
  await Comment.deleteMany({
    user:user._id
  })

  // delete user himself
  await User.findByIdAndDelete(req.params.id)
  // send response to the client
  res.status(200).json({message:"your profile has been deleted successfully"})
})