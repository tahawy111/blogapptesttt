const mongoose=require("mongoose")
const Joi=require("joi")
const passwordComplexity=require("joi-password-complexity")
const jwt=require("jsonwebtoken")
// user schema

const UserSchema=mongoose.Schema({
  username:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
    maxlength:100,

  },
  email:{
    type:String,
    required:true,
    trim:true,
    minlength:5,
    maxlength:100,
    uniqure:true,
  },
  password:{
    type:String,
    required:true,
    trim:true,
    minlength:8,
  },
  profilePhoto:{
    type:Object,
    default:{
      url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      publicId:null,
    }
  },
  bio:{
    type:String,

  },
  isAdmin:{
    type:Boolean,
    default:false,

  },
  isAccountVerified:{
    type:Boolean,
    default:false,

  },
},{
  timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

UserSchema.virtual("posts" ,{
  ref:"Post",
  foreignField:"user",
  localField:"_id"
})

// generate auth token
UserSchema.methods.generateAuthToken=function(){
return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.JWT_SECRET)
}

// User Model

const User=mongoose.model("User",UserSchema)

// validate register user
function validateRegisterUser(obj){
const schema=Joi.object({
  username:Joi.string().trim().min(2).max(100).required(),
  email:Joi.string().trim().min(5).max(100).required().email(),
  password:passwordComplexity().required(),
})
return schema.validate(obj)
}

// validate login user
function validateLoginUser(obj){
  const schema=Joi.object({
    email:Joi.string().trim().min(5).max(100).required().email(),
    password:Joi.string().trim().min(8).required(),
  })
  return schema.validate(obj)
  }

  // validate update user
function validateUpdateUser(obj){
  const schema=Joi.object({
    username:Joi.string().trim().min(2).max(100),
    password:passwordComplexity(),
    bio:Joi.string(),
  })
  return schema.validate(obj)
  }

    // validate Email 
function validateEmail(obj){
  const schema=Joi.object({
    email:Joi.string().trim().min(5).max(100).email(),
  })
  return schema.validate(obj)
  }
    // validate new password
function validateNewPassword(obj){
  const schema=Joi.object({
    password:passwordComplexity().required()
  })
  return schema.validate(obj)
  }



module.exports={
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateEmail,
  validateNewPassword,
}