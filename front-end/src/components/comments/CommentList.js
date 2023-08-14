import React, { useState } from 'react';
import './comment-list.css'
import {AiOutlineEdit} from 'react-icons/ai'
import {AiOutlineDelete} from 'react-icons/ai'
import swal from 'sweetalert';
import UpdateCommentModal from './UpdateCommentModal';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../redux/apiCalls/commentApiCall';

const CommentList = ({comments}) => {
  const dispatch=useDispatch()
const {user}=useSelector(state => state.auth)
  const[updateComment,setUpdateComment]=useState(false)
  const [commentForUpdate , setCommentForUpdate]=useState(null)
  // update comment handler
  const updateCommentHandler =(comment)=>{
    setCommentForUpdate(comment)
    setUpdateComment(true)
  }
  
  // delete comment handler
  const deleteCommentHandler=(commentId)=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((isOk) => {
      if (isOk) {
        dispatch(deleteComment(commentId))
        } 
    });
   }
  return (
    <div className='comment-list'>
      <h4 className="comment-list-count">{comments?.length} comments</h4>
      {
        comments?.map((comment)=>(  
          <div key={comment?._id} className='comment-item'>
            <div className="comment-item-info">
            <div className="comment-item-username">
              {comment?.username}
            </div>
            <div className="comment-item-time">
              <Moment fromNow ago>
                {
                  comment?.createdAt
                }
              </Moment> {""} ago
            </div>

            </div>
            <p className="comment-item-text">
              {comment?.text}
            </p>
          {
            user?._id === comment?.user && (
              <div className="comment-item-icon-wrapper">

              <AiOutlineEdit onClick={()=>updateCommentHandler(comment)} className='comment-item-icon-edit'/>
              <AiOutlineDelete onClick={()=> deleteCommentHandler(comment?._id)} className='comment-item-icon-delete'/>
              </div>
            )
          }
          </div>
        ))
      }
      {
        updateComment && <UpdateCommentModal commentForUpdate={commentForUpdate} setUpdateComment={setUpdateComment}/>
      }
    </div>
  );
}

export default CommentList;