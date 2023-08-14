import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createCategory } from '../../redux/apiCalls/categoryApiCall';

const AddCategoryForm = () => {
  const dispatch=useDispatch()
  const [title,setTitle]=useState("")
  // form submit handler
  const formSubmitHandler=(e)=>{
    e.preventDefault()
    if(title.trim()==="") return toast.error("category title is required")
    dispatch(createCategory({title}))
    setTitle("")
  }

  return (
    <div className="add-category">
      <h5 className='add-category-title'>add new category</h5>
      <form onSubmit={formSubmitHandler} action="" className='add-category-form' >
        <div className="add-category-form-group">
          <label htmlFor="title">Category Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" id='title'
          placeholder='enter category title' />
        </div>
        <button type='submit' className='add-category-btn'>Add</button>
      </form>
    </div>
  );
}

export default AddCategoryForm;
