import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom'
import './post-details.css'
import {BiSolidImageAdd} from 'react-icons/bi'
import {AiFillLike} from 'react-icons/ai'
import {AiOutlineEdit} from 'react-icons/ai'
import {AiOutlineDelete} from 'react-icons/ai'
import {toast } from 'react-toastify'
import AddComment from '../../components/comments/AddComment';
import CommentList from '../../components/comments/CommentList';
import swal from 'sweetalert';
import UpdatePostModal from './UpdatePostModal';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, fetchSinglePost , toggleLikePost, updatePostImage } from '../../redux/apiCalls/postApiCall';




const PostDetails = () => {
  const dispatch=useDispatch();
  const {post}=useSelector(state => state.post) 
  const {user}=useSelector(state => state.auth) 
  const {id}=useParams();
  const navigate=useNavigate()
  console.log(post);
  useEffect(() => {
    window.scrollTo(0 , 0)
    dispatch(fetchSinglePost(id))
    
  }, [id]);
  const [file , setFile]=useState(null)
  const [updatePost,setUpdatePost]=useState(false)
  // upload image submit handler
  const updateImageSubmitHandler=(e)=>{
     e.preventDefault();
     if(!file) return toast.warning("there is no file!")
     const formData=new FormData();
    formData.append("iamge" , file);
    dispatch(updatePostImage(formData , post?._id))
     

  }

  // delete post handler
   const deletePostHandler=()=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((isOk) => {
      if (isOk) {
      dispatch(deletePost(post?._id))
      navigate(`/profile/${user?._id}`)
      } 
    });
   }
  
  return (
    <section className='post-details'>
      <div className="post-details-image-wrapper">
        <img src={file ? URL.createObjectURL(file) : post?.image.url} alt="" className="post-details-image" />
        {
          user?._id === post?.user._id && (
            <form onSubmit={updateImageSubmitHandler} action="" className='update-post-image-form'>
              <label htmlFor="file" className='update-post-label'>
                  <BiSolidImageAdd/>
                  Select new image
              </label>
              <input onChange={(e)=>setFile(e.target.files[0])} style={{display:"none"}} type="file" name='file' id='file' />
              <button type='submit'>Upload</button>
          </form>
          )
        }
      </div>
      <h1 className='post-details-title'>{post?.title}</h1>
      <div className="post-details-user-info">
        <img src={post?.user.profilePhoto?.url} className='post-details-user-image' alt="" />
        <div className="post-details-user">
          <strong>
            <Link to={`/profile/${post?.user._id}`} >{post?.user.username}</Link>
          </strong>
          <span>
            {
              new Date(post?.createdAt).toDateString()
            }
          </span>
        </div>
      </div>
      <p className="post-details-description">
        {
          post?.description
        }
        Lorem ipsum dolor sit amet consectetur adipisicing elit. um dolor sit amet consectetur adipisicing elit. Ipum dolor sit amet consectetur adipisicing elit. Ipum dolor sit amet consectetur adipisicing elit. IpIpsa exercitationem suscipit autem! Corrupti, aspernatur at quae, deserunt obcaecati provident earum fugiat necessitatibus, eaque dignissimos atque eligendi accusantium repudiandae saepe reprehenderit!
      </p>
      <div className="post-details-icon-wrapper">
        <div>
          {
            user && (
              <AiFillLike className={post?.likes.includes(user?._id) ? "like-fill" : ''} onClick={()=> dispatch(toggleLikePost(post?._id))}/>
            )
          }
        
          <small>{post?.likes.length} likes</small>
        </div>
        {
          user?._id === post?.user?._id && (
            <div>
          <AiOutlineEdit onClick={()=> setUpdatePost(true)}/>
          <AiOutlineDelete onClick={deletePostHandler} className='post-details-delete'/>
        </div>
          )
        }
      </div>
      {
        user ?  <AddComment postId={post?._id} /> : <p className='post-details-info-write'>to write a comment you should login first</p>

      }
      <CommentList comments={post?.comments}/>
      {
        updatePost &&   <UpdatePostModal post={post} setUpdatePost={setUpdatePost}/>
      }
    
    </section>
  );
}

export default PostDetails;
