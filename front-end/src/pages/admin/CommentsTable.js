import React, { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin-table.css'
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, fetchAllComments } from '../../redux/apiCalls/commentApiCall';

const CommentsTable = () => {
  const {comments}=useSelector(state => state.comment)
  const dispatch=useDispatch()
  useEffect(() => {
    dispatch(fetchAllComments())
  }, []);
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
    <section className='table-container'>
      <AdminSidebar/>
      <div className="table-wrapper">
        <h1 className="table-title">Comments</h1>
        <table className='table'>
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              comments?.map((item , index)=>(
                <tr key={item}>
                    <td>{index + 1}</td>
                    <td>
                      <div className='table-image'>
                          <img className='table-user-image' src={item.user.profilePhoto?.url} alt="" />
                          <span className='table-username'>{item.user.username}</span>
                      </div>
                    </td>
                    <td>{item.text}</td>
                    <td>
                      <div className="table-button-group">
                      
                        <button onClick={()=>deleteCommentHandler(item._id)}>
                          Delete Comment
                        </button>
                      </div>
                    </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CommentsTable;
