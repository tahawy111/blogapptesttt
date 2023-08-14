import React, { useState , useEffect } from 'react';
import './create-post.css'
import {toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../redux/apiCalls/postApiCall';
import {RotatingLines} from 'react-loader-spinner'
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';


const CreatePost = () => {
  const dispatch=useDispatch()

  const {categories}=useSelector(state => state.category)

  const {loading , isPostCreated}=useSelector(state => state.post)
  const[title,setTitle]=useState("")
  const[description,setDescription]=useState("")
  const[category,setCategory]=useState("")
  const[file,setFile]=useState(null)

  // form submit handler
  const formSubmitHandler=(e)=>{
e.preventDefault()
if(title.trim()===""){
  return toast.error("post title is required");
}
if(category.trim()===""){
  return toast.error("post category is required");
}
if(description.trim()===""){
  return toast.error("post description is required");
}
if(!file){
  return toast.error("post image is required");
}
const formData=new FormData();
formData.append("image" , file);
formData.append("title" , title);
formData.append("category" , category);
formData.append("description" , description);

dispatch(createPost(formData))

}

const navigate=useNavigate();

useEffect(() => {
  if(isPostCreated){
    navigate("/")
  }

}, [isPostCreated , navigate]);

useEffect(() => {
  dispatch(fetchCategories)
}, []);

  return (
    <section className="create-post">
      <h1 className="create-post-title">
        Create New Post
      </h1>
      <form onSubmit={formSubmitHandler} className='create-post-form' >
        <input type='text' placeholder='Post Title' className='create-post-input' value={title} onChange={(e)=>setTitle(e.target.value)} />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className='create-post-input' >
          <option disabled value="">Select a category</option>
          {
            categories.map((cat)=>   <option key={cat._id} value={cat.title}>{cat.title}</option>
            )
          }
          
        </select>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className='create-post-textarea' placeholder='Description' rows="5"></textarea>
        <input  onChange={(e)=>setFile(e.target.files[0])} type="file" name='file' id='file' className='create-post-upload' />
        <button type='submit' className='create-post-btn'>
          {
            loading ? <RotatingLines
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            width="40"
            visible={true}
          />
           : "Create"
          }          
          </button>
      </form>
    </section>
  );
}

export default CreatePost;
