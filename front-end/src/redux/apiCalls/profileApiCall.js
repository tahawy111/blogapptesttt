import request from "../../utils/request";
import { toast} from 'react-toastify'
import { profileActions } from "../slices/profileSlice";
import { authActions } from "../slices/authSlice";


// get user profile
export function getUserProfile(userId){
  return async(dispatch)=>{
    try {
    
      const {data}=await request.get(`/api/users/profile/${userId}`)
      dispatch(profileActions.setProfile(data))
    } catch (error) {
      toast.error(error.response.data.message)
      
    }
  }
}


// upload profile photo
export function uploadProfilePhoto(newPhoto){
  return async(dispatch ,getState)=>{
    try {
    
      const {data}=await request.post(`/api/users/profile/profile-photo-upload` , newPhoto , {
        headers:{
           Authorization:"Bearer " + getState().auth.user.token,
          "Content-Type" : "multipart/form-data"
        }
      })
      console.log(data);
       dispatch(profileActions.setProfilePhoto(data.profilePhoto))
       dispatch(authActions.setUserPhoto(data.profilePhoto))
      toast.success(data.message)
      // modify the user in local storage with new photo
      const user=JSON.parse(localStorage.getItem("userInfo"));
      user.profilePhoto=data?.profilePhoto;
      localStorage.setItem("userInfo" , JSON.stringify(user))

    } catch (error) {
      toast.error(error.response.data.message)
      
    } 
  }
}


// Update Profile
export function updateProfile(userId,profile) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/users/profile/${userId}`,
        profile,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );

      dispatch(profileActions.updateProfile(data));
      dispatch(authActions.setUsername(data.username));

      // modify the user in local storage with new username
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.username = data?.username;
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Delete profile (account)
export function deleteProfile(userId){
  return async(dispatch ,getState)=>{
    try {
    dispatch(profileActions.setLoading())
      const {data}=await request.delete(`/api/users/profile/${userId}` , {
        headers:{
           Authorization:"Bearer " + getState().auth.user.token,    
        }
      })
    
       dispatch(profileActions.setIsProfileDeleted())
       toast.success("profile deleted successfully")
       setTimeout(() => {
      dispatch(profileActions.clearIsProfileDeleted())
       }, 2000);
    } catch (error) {
      toast.error(error.response.data.message)
      dispatch(profileActions.clearLoading())
    } 
  }
}   


// Get users count (for admin dashboard)
export function getUserCount(){
  return async(dispatch ,getState)=>{
    try {
      const {data}=await request.get(`/api/users/count` , {
        headers:{
           Authorization:"Bearer " + getState().auth.user.token,    
        }
      })
    
       dispatch(profileActions.setUsersCount(data))
      
    } catch (error) {
      toast.error(error.response.data.message)
    } 
  }
}   

// Get All users profile (for admin dashboard)
export function getAllUsersProfile(){
  return async(dispatch ,getState)=>{
    try {
      const {data}=await request.get(`/api/users/profile` , {
        headers:{
           Authorization:"Bearer " + getState().auth.user.token,    
        }
      })
    
       dispatch(profileActions.setProfiles(data))
      
    } catch (error) {
      toast.error(error.response.data.message)
    } 
  }
}   