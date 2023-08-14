import React, { useState ,useEffect } from 'react';
import './update-post.css'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../redux/apiCalls/postApiCall';
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';

const UpdatePostModal = ({setUpdatePost , post}) => {
  const dispatch=useDispatch()
  const {categories}=useSelector(state => state.category)
  const[title,setTile]=useState(post.title)
  const[description,setDescription]=useState(post.description)
  const[category,setCategory]=useState(post.category)

  // form submit handler
  const formSubmitHandler=(e)=>{
    e.preventDefault();
    if(title.trim()===""){
      return toast.error("post title is required");
    }
    if(category.trim()===""){
      return toast.error("post category is required");
    }
    if(description.trim()===""){
      return toast.error("post description is required");
    }
    dispatch(updatePost({title,  description , category} , post?._id))
  setUpdatePost(false)
  }
  useEffect(() => {
    dispatch(fetchCategories())
  }, []);
  return (
    <div className="update-post">
        <form onSubmit={formSubmitHandler} className="update-post-form">
          <abbr title="close">
            <AiOutlineCloseCircle onClick={()=>setUpdatePost(false)} className='update-post-form-close'/>
          </abbr>
          <h1 className='update-post-title'>Update Post</h1>
          <input value={title} onChange={(e)=>setTile(e.target.value)} type="text" className='update-post-input'/>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className='update-post-input'>
             <option disabled value="">Select a category</option>
             {
              categories.map((cat)=> (<option key={cat._id}  value={cat.title}>{cat.title}</option>))
             }

          </select>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className='update-post-textarea' rows="5"></textarea>
          <button type='submit' className='update-post-btn'>Update Post</button>
        </form>
    </div>
  );
}

export default UpdatePostModal;
