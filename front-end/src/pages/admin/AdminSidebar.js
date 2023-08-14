import React from 'react';
import { Link } from 'react-router-dom';
import {BsFillPersonFill} from 'react-icons/bs'
import {AiFillFileImage} from 'react-icons/ai'
import {BiCategory} from 'react-icons/bi'
import {FaComments} from 'react-icons/fa'
import {MdOutlineDashboardCustomize} from 'react-icons/md'


const AdminSidebar = () => {
  return (
  <div className="admin-sidebar">
    <Link to="/admin-dashboard" className='admin-sidebar-title'><MdOutlineDashboardCustomize/> Dashboard</Link>
    <ul className='admin-dashboard-list'>
      <Link className='admin-sidebar-link' to="/admin-dashboard/users-table">
          <BsFillPersonFill/>
          Users
      </Link>
      <Link className='admin-sidebar-link' to="/admin-dashboard/posts-table">
          <AiFillFileImage/>
          Posts
      </Link>
      <Link className='admin-sidebar-link' to="/admin-dashboard/categories-table">
          <BiCategory/>
          Categories
      </Link>
      <Link className='admin-sidebar-link' to="/admin-dashboard/comments-table">
          <FaComments/>
          Comments
      </Link>
      
    </ul>
  </div>
  );
}

export default AdminSidebar;
