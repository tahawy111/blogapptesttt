const cloudinary=require("cloudinary")

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})

// cloudinary upload image 
const cloudinaryUploadImage=async(fileToUpload)=>{
  try {
    const data= await cloudinary.uploader.upload(fileToUpload , {
      resource_type:'auto'
    });
    return data
  } catch (error) {
    throw  new Error("Internal server error (cloudinary) ");
    console.log(error);
  }
}

// cloudinary remove image
const cloudinaryRemoveImage=async(imagePublicId)=>{
  try {
    const data= await cloudinary.uploader.destroy(imagePublicId);
    return data
  } catch (error) {
    throw  new Error("Internal server error (cloudinary) ");
    console.log(error);
  }
}


// cloudinary remove multiple image
const cloudinaryRemoveMultipleImage=async(publicIds)=>{
  try {
    const data= await cloudinary.v2.api.delete_resources(publicIds)
    return data
  } catch (error) {
    throw  new Error("Internal server error (cloudinary) ");
    console.log(error);
  }
}

module.exports={
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
}