import React, { useEffect, useState } from 'react';
import './profile.css'
import PostList from '../../components/posts/PostList';
import {AiOutlineCamera} from 'react-icons/ai'
import {AiOutlineEdit} from 'react-icons/ai'
import {toast } from 'react-toastify'
import swal from 'sweetalert';
import UpdateProfileModal from './UpdateProfileModal';
import { useDispatch , useSelector } from 'react-redux';
import { deleteProfile, getUserProfile, uploadProfilePhoto } from '../../redux/apiCalls/profileApiCall';
import { logoutUser } from '../../redux/apiCalls/authApiCall';

import { useNavigate, useParams } from 'react-router-dom';
import PostItem from '../../components/posts/PostItem';
import { Oval } from 'react-loader-spinner';

const Profile = () => {
  const dispatch=useDispatch();
  const {profile , loading , isProfileDeleted}=useSelector(state =>state.profile)
  const {user}=useSelector(state =>state.auth)
  const[file,setFile]=useState(null)
  const[updateProfile,setUpdateProfile]=useState(false)

  const { id} =useParams()
  useEffect(() => {
    dispatch(getUserProfile(id))
    window.scrollTo(0,0)
    if(updateProfile){
      dispatch(getUserProfile(id))
    }
  }, [id , updateProfile] );

  const navigate=useNavigate()
  useEffect(() => {
    if(isProfileDeleted){
      navigate("/")
    }
  }, [navigate , isProfileDeleted]);

  // form submit handler 
  const formSubmitHandler=(e)=>{
    e.preventDefault();
    if(!file) return toast.warning("there is no image to upload !");
    const formData=new FormData();
    formData.append("image" , file)
      dispatch(uploadProfilePhoto(formData))
  }
    // delete profile handler
    const deleteAccountHandler=()=>{
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((isOk) => {
        if (isOk) {
            dispatch(deleteProfile(user?._id))
            dispatch(logoutUser())
        }
      });
     }
     if(loading) {
      return (
        <div className='profile-loader'>
          <Oval
              height={120}
              width={120}
              color="#000"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="grey"
              strokeWidth={3}
              strokeWidthSecondary={3}

/>
        </div>
      )
     }

  return (
    <section className="profile">
      
        <div className="profile-header">
            <div className="profile-image-wrapper">
              <img src={file ? URL.createObjectURL(file) : profile?.profilePhoto?.url} className='profile-image' alt="" />
              {
                user?._id ===profile?._id && (
                  <form onSubmit={formSubmitHandler} >
                <abbr title="choose profile photo">
                  <label htmlFor="file" className='upload-profile-photo-icon'><AiOutlineCamera/></label>
                </abbr>
                  <input onChange={(e)=>setFile(e.target.files[0])} style={{display:"none"}} type="file" id='file' />
                  <button type='submit' className='upload-profile-photo-btn'>upload</button>
              </form>
                )
              }
            </div>
            <h1 className='profile-username'>{profile?.username}</h1>
            <p className="profile-bio">
            {profile?.bio}
            </p>
            <div className="user-date-joined">
              <strong>Date Joined:</strong>
              <span>{new Date(profile?.createdAt).toDateString()}</span>
            </div>
            {
              user?._id === profile?._id && (
                <button onClick={()=>setUpdateProfile(true)} className='profile-update-btn'>
                <AiOutlineEdit  />
                Update Profile
              </button>
              )
            }
          
        </div>
        <div className="profile-posts-list">
          
          <h2 className='profile-posts-list-title'>{profile?.username} Posts</h2>
        {
          profile?.posts?.map((post) =>(<PostItem key={post._id} post={post} username={profile?.username} userId={profile?._id}/>) )
        }
        </div>
        {
              user?._id === profile?._id && (
                <button onClick={deleteAccountHandler} className="delete-account-btn">
                Delete Your Account
               </button>
              )
            }
        
         {
          updateProfile && ( <UpdateProfileModal profile={profile} setUpdateProfile={setUpdateProfile} />)
         }
    </section>
  );
}

export default Profile;
