const mongoose=require("mongoose");
const Joi=require("joi");

// Post schema
const PostSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
    maxlength:200,
  },
  description:{
    type:String,
    required:true,
    trim:true,
    minlength:10,
    
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  image:{
    type:Object,
    default:{
      url:"",
      publicId:null,
    }
  },
  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
  ]


},{timestamps:true , 
  toJSON:{virtuals:true} ,toObject:{virtuals:true}} 
) 

// populate comments for this post
PostSchema.virtual("comments" ,{
  ref:"Comment",
  foreignField:"postId",
  localField:"_id",
})

const Post=mongoose.model("Post", PostSchema)


// validate create post function
function validateCreatePost(obj){
  const schema=Joi.object({
    title:Joi.string().trim().min(2).max(200).required(),
    description:Joi.string().trim().min(10).required(),
    category:Joi.string().trim().required(),
  })
  return schema.validate(obj);
}

// validate update post function
function validateUpdatePost(obj){
  const schema=Joi.object({
    title:Joi.string().trim().min(2).max(200),
    description:Joi.string().trim().min(10),
    category:Joi.string().trim(),
  })
  return schema.validate(obj);
}

module.exports={
  Post,
  validateCreatePost,
  validateUpdatePost,
}