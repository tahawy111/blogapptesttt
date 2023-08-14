import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {BsFillPersonFill} from 'react-icons/bs'
import {AiFillFileImage} from 'react-icons/ai'
import AddCategoryForm from './AddCategoryForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';
import { getUserCount } from '../../redux/apiCalls/profileApiCall';
import { getPostsCount } from '../../redux/apiCalls/postApiCall';
import { fetchAllComments } from '../../redux/apiCalls/commentApiCall';


const AdminMain = () => {
  const dispatch=useDispatch();
  const {categories}=useSelector(state => state.category)
  const {usersCount}=useSelector(state => state.profile)
  const {postsCount}=useSelector(state => state.post)
  const {comments}=useSelector(state => state.comment)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(getUserCount())
    dispatch(getPostsCount())
    dispatch(fetchAllComments())
  }, []);
  return (
    <div className="admin-main">
      <div className="admin-main-header">
        <div className="admin-main-card">
          <h4 className="admin-card-title">
              Users
          </h4>
          <div className="admin-card-count">{usersCount}</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to='/admin-dashboard/users-table'>
            See all users
            </Link>
            <div className="admin-card-icon">
            <BsFillPersonFill/>
            </div>
          </div>
        </div>

        <div className="admin-main-card">
          <h4 className="admin-card-title">
              Posts
          </h4>
          <div className="admin-card-count">{postsCount}</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to='/admin-dashboard/posts-table'>
            See all posts
            </Link>
            <div className="admin-card-icon">
            <AiFillFileImage/>
            </div>
          </div>
        </div>

        <div className="admin-main-card">
          <h4 className="admin-card-title">
              Categories
          </h4>
          <div className="admin-card-count">{categories.length}</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to='/admin-dashboard/categories-table'>
            See all categories
            </Link>
            <div className="admin-card-icon">
            <AiFillFileImage/>
            </div>
          </div>
        </div>

        <div className="admin-main-card">
          <h4 className="admin-card-title">
              Comments
          </h4>
          <div className="admin-card-count">{comments.length}</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to='/admin-dashboard/comments-table'>
            See all comments
            </Link>
            <div className="admin-card-icon">
            <AiFillFileImage/>
            </div>
          </div>
        </div>
      </div>
      <AddCategoryForm/>
    </div>
  );
}

export default AdminMain;
