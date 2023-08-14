const asyncHandler=require("express-async-handler")
const {Comment, validateCreateComment, validateUpdateComment }=require("../models/Comment")
const {User}=require("../models/User")

// create new comment
// api/comments
// POST method
// private (only logged in users)

module.exports.createCommentCtrl=asyncHandler(async(req,res)=>{
  const {error}=validateCreateComment(req.body)
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  const profile=await User.findById(req.user.id)
  const comment=await Comment.create({
    postId:req.body.postId,
    text:req.body.text,
    user:req.user.id,
    username:profile.username,
  })
  res.status(201).json(comment)
})


// get all comments
// api/comments
// GET method
// private (only admins)

module.exports.getAllCommentsCtrl=asyncHandler(async(req,res)=>{
  const comments=await Comment.find().populate("user")
  res.status(200).json(comments)
})


// delete comment
// api/comment/:id
// DELETE method
// private (only admin OR owner of the comment)

module.exports.deleteCommentCtrl=asyncHandler(async(req,res)=>{
  const comment=await Comment.findById(req.params.id)
  if(!comment){
    return res.status(404).json({message:"error comment not  found"})
  }

  if(req.user.isAdmin || req.user.id ===comment.user.toString()){
    await Comment.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"comment has been deleted"})
  }else{
    res.status(403).json({message:"access denied , not allowed"})

  }
})


// update comment
// api/comments/:id
// PUT method
// private (only owner of the comment)

module.exports.updateCommentCtrl=asyncHandler(async(req,res)=>{
  const {error}=validateUpdateComment(req.body)
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  const comment=await Comment.findById(req.params.id)
  if(!comment){
    return res.status(404).json({message:"comment not found"})
  }
  if(req.user.id !== comment.user.toString()){
    return res.status(403).json({message:"forbidden , only user himself can delete update "})
  }
  const updatedComment=await Comment.findByIdAndUpdate(req.params.id , {
    $set:{
      text:req.body.text,
    }
  } , {new:true})

  res.status(200).json(updatedComment)
  
})