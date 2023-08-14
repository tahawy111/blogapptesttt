import React, { useState } from 'react';
import './add-comment.css'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createComment } from '../../redux/apiCalls/commentApiCall';

const AddComment = ({postId}) => {
  const dispatch=useDispatch()
  const [text,setText]=useState("")
  const formSubmitHandler=(e)=>{
    e.preventDefault();
    if(text.trim()==="")
    return toast.error("Please write something")
    console.log(text);
    dispatch(createComment({text , postId}))
    setText("")
  }
  return (
    <form onSubmit={formSubmitHandler} className='add-comment'>
      <input value={text} onChange={(e)=> setText(e.target.value)} type="text" placeholder='Add a comment' className='add-comment-input' />
      <button type='submit' className='add-comment-btn'>Comment</button>
    </form>
  );
}

export default AddComment;
