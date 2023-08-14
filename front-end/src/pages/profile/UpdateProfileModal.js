import React, { useState } from 'react';
import './update-profile.css'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/apiCalls/profileApiCall';



const UpdateProfileModal = ({setUpdateProfile , profile}) => {
const dispatch=useDispatch()
  const[username,setUsaername]=useState(profile.username)
  const[bio,setBio]=useState(profile.bio)
  const[password,setPassword]=useState("")

  // form submit handler
  const formSubmitHandler=(e)=>{
    e.preventDefault();
    const updatedUser={username , bio}
    if(password.trim()!=="")
    {
      updatedUser.password=password
    }
    dispatch(updateProfile(profile?._id , updatedUser))
    setUpdateProfile(false)
  }

  return (
    <div className="update-profile">
        <form onSubmit={formSubmitHandler} className="update-profile-form">
          <abbr title="close">
            <AiOutlineCloseCircle onClick={()=>setUpdateProfile(false)} className='update-profile-form-close'/>
          </abbr>
          <h1 className='update-profile-title'>Update Profile</h1>
          <input  value={username} onChange={(e)=>setUsaername(e.target.value)} type="text" placeholder='Username' className='update-profile-input'/>
          <input value={bio} onChange={(e)=>setBio(e.target.value)} type="text" placeholder='Bio' className='update-profile-input'/>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' className='update-profile-input'/>

          <button type='submit' className='update-profile-btn'>Update Profile</button>
        </form>
    </div>
  );
}

export default UpdateProfileModal;
