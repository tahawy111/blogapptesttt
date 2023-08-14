const fs=require("fs")
const path=require("path")
const asyncHandler=require("express-async-handler")
const {Post , validateCreatePost , validateUpdatePost}=require("../models/Post")
const {cloudinaryUploadImage, cloudinaryRemoveImage} =require("../utils/cloudinary")
const {Comment} = require("../models/Comment")

// create new post
// api/posts
// only logged in users
module.exports.createPostCtrl=asyncHandler(async(req,res)=>{
  // validation for image
  if(!req.file){
    return res.status(400).json({message:"no image provided"})
  }
  // validation for data
  const{error}=validateCreatePost(req.body)
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  // upload image
  const imagePath=path.join(__dirname,`../images/${req.file.filename}`)
  const result=await cloudinaryUploadImage(imagePath)
// create new post and save it to database
const post=await Post.create({
  title:req.body.title,
  description:req.body.description,
  category:req.body.category,
  user:req.user.id,
  image:{
    url:result.secure_url,
    publicId:result.public_id,
  }
})
// send response to the client
res.status(201).json(post)
console.log(post);
// delete image from server
fs.unlinkSync(imagePath)
})

// get all posts
// /api/posts 
// GET method

module.exports.getAllPostsCtrl=asyncHandler(async(req,res)=>{
  const POST_PER_PAGE=3
  const {pageNumber,category}=req.query;
  let posts;
  if(pageNumber){
    posts=await Post.find().skip((pageNumber - 1) * POST_PER_PAGE).limit(POST_PER_PAGE).sort({createdAt:-1}).populate("user" , ["-password"])
  }else if(category){
    posts= await Post.find({category:category}).sort({createdAt:-1}).populate("user" , ["-password"])
  }else{
    posts=await Post.find().sort({createdAt:-1}).populate("user" , ["-password"])
  }
  res.status(200).json(posts); 
})

// get single post
// /api/posts/:id
module.exports.getSinglePostCtrl=asyncHandler(async(req,res)=>{
  const post=await Post.findById(req.params.id).populate("user" , ["-password"]).populate("comments")
  if(!post)
  {
    return res.status(404).json({message:"post not found"})
  }

  res.status(200).json(post); 
})

// get posts count
// /api/posts/count
module.exports.getPostCountCtrl=asyncHandler(async(req,res)=>{
  const count=await Post.count();
  res.status(200).json(count); 
})

// delete post
// /api/posts/:id
// method DELETE
//  only admin or post's owner
module.exports.deletePostCtrl=asyncHandler(async(req,res)=>{
  const post=await Post.findById(req.params.id)
  if(!post)
  {
    return res.status(404).json({message:"post not found"})
  }
  if(req.user.isAdmin || req.user.id===post.user.toString()){
     await Post.findByIdAndDelete(req.params.id);
     await cloudinaryRemoveImage(post.image.publicId)

    //  delete all comments that belongs to this post
    await Comment.deleteMany({
      postId:post._id
    })
    res.status(200).json({message:"post has been deleted successfully" , postId:post._id})
  }else{
    res.status(403).json({message:"access denied"})
  }
})


// update post
// /api/posts/:id
// PUT method
// access : only owner of the post

module.exports.updatePostCtrl=asyncHandler(async(req,res)=>{
  // validate post
  const {error}=validateUpdatePost(req.body)
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  // get the post from db and check if post exists
  const post=await Post.findById(req.params.id)
  if(!post){
    return res.status(404).json({message:"post not found"})
  }
  // check if this post belong to logged in user
  if(req.user.id !==post.user.toString()){
    return res.status(403).json({message:"access denied , you are not allowed"})
  }
  // update post
  const updatedPost=await Post.findByIdAndUpdate(req.params.id , {
    $set:{
      title:req.body.title,
      description:req.body.description,
      category:req.body.category,
    }
  }, {new : true}).populate("user" , ["-password"]).populate("comments")
  
  // send response to the client
  res.status(200).json(updatedPost)
})


// update post image
// api/posts/update-image/:id
// PUT method
// only post owner

module.exports.updatePostImageCtrl=asyncHandler(async(req,res)=>{
  // validate post
  if(!req.file){
    return res.status(404).json({message:"no image provided"})
  }

  // get the post from db and check if post exists
  const post=await Post.findById(req.params.id)

  // check if this post belong to logged in user
  if(req.user.id != post.user.toString()){ //feh problem hna ....................
    return res.status(403).json({message:"access denied , you are not allowed"})
  }
  // delete the old image
  await cloudinaryRemoveImage(post.image.publicId)

  // upload new photo
  const imagePath=path.join(__dirname , `../images/${req.file.filename}`)
  const result=await cloudinaryUploadImage(imagePath)
  
  const updatedPost=await Post.findByIdAndUpdate(req.params.id , {
    $set:{
    image:{
      url:result.secure_url,
      publicId:result.public_id
    }
    }
  }, {new : true})

  // send response to the client
  res.status(200).json(updatedPost)

  // remove image from server
  fs.unlinkSync(imagePath)

})


// Toggle like
// /api/posts/like/:id 
// put METHOD
// only logged in user

module.exports.toggleLikeCtrl=asyncHandler(async(req,res)=>{
  let post=await Post.findById(req.params.id)
  if(!post){
    return res.status(404).json({message:"post not found"})
  }
  const isPostAlreadyLiked=post.likes.find((user)=> user.toString()=== req.user.id)
  if(isPostAlreadyLiked){
    post=await Post.findByIdAndUpdate(req.params.id,{
      $pull:{ likes:req.user.id}
    } , {new:true}
    )
  }else{
    post=await Post.findByIdAndUpdate(req.params.id,{
      $push:{ likes:req.user.id}
    } , {new:true}
    )
  }
  res.status(200).json(post)
})