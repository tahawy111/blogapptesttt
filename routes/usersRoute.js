const router=require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require("../controllers/usersController");
const { verifyToken , verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyTokenAndOnAuthorization } = require("../middlewares/verifyToken");
const validateObjectId=require("../middlewares/validateObjectId");
const { validateUpdateUser } = require("../models/User");
const photoUpload = require("../middlewares/photoUpload");


// api/users/profile
router.route("/profile").get(verifyTokenAndAdmin,getAllUsersCtrl)

// api/users/profile/:id
router.route("/profile/:id").get(validateObjectId,getUserProfileCtrl).put(validateObjectId,verifyTokenAndOnlyUser,updateUserProfileCtrl)
.delete(validateObjectId,verifyTokenAndOnAuthorization,deleteUserProfileCtrl)


// api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload").post(verifyToken,photoUpload.single("image"), profilePhotoUploadCtrl)


// api/users/count
router.route("/count").get(verifyTokenAndAdmin,getUsersCountCtrl)




module.exports=router;