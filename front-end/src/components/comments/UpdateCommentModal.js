import React, { useState } from 'react';
import './update-comment.css'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateComment } from '../../redux/apiCalls/commentApiCall';



const UpdateCommentModal = ({setUpdateComment  ,commentForUpdate}) => {
  const dispatch=useDispatch()
  const[text,setText]=useState(commentForUpdate?.text)
  // form submit handler
  const formSubmitHandler=(e)=>{
    e.preventDefault();
    if(text.trim()==="") return toast.error("comment is required");
    dispatch(updateComment(commentForUpdate?._id , {text}))
    setUpdateComment(false)
  
  }
  return (
    <div className="update-comment">
        <form onSubmit={formSubmitHandler} className="update-comment-form">
          <abbr title="close">
            <AiOutlineCloseCircle onClick={()=>setUpdateComment(false)} className='update-post-form-close'/>
          </abbr>
          <h1 className='update-comment-title'>Edit Comment</h1>
          <input value={text} onChange={(e)=>setText(e.target.value)} type="text" className='update-comment-input'/>
        
          <button type='submit' className='update-comment-btn'>Edit Comment</button>
        </form>
    </div>
  );
}

export default UpdateCommentModal;
