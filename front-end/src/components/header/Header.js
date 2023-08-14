import React, { useState } from "react";
import './header.css'
import { BsFillPencilFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillStickiesFill } from "react-icons/bs";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsBoxArrowRight } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillFilePersonFill } from "react-icons/bs";
import { AiFillCaretLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import {useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/apiCalls/authApiCall";


const Header = () => {
  const dispatch=useDispatch()
  const {user} =useSelector(state => state.auth)
  const [toggle,setToggle]=useState(false)
  const [dropdown,setDropdown]=useState(false)

  // logout handler
  const logoutHandler=()=>{
    setDropdown(false);
    dispatch(logoutUser())
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <strong>BLOG</strong>
          <BsFillPencilFill />  
        </div>
        <div onClick={()=>setToggle(prev => !prev)} className="header-menu">
          {
            toggle ? <AiFillCloseCircle/> : <GiHamburgerMenu/>
          }
        
        </div>
      </div>
      <nav style={{clipPath:toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}} className="navbar">
        <ul className="nav-links">
          <Link to="/" onClick={()=> setToggle(false)} className="nav-link">
            <AiOutlineHome/>  Home
          </Link>
          <Link to="/posts" onClick={()=> setToggle(false)} className="nav-link">
            <BsFillStickiesFill/>  Posts
          </Link> 
          {
            user && (
                <Link to="/posts/create-post" onClick={()=> setToggle(false)} className="nav-link">
                  <BsFillJournalBookmarkFill/>  Create
                </Link>
            )
          }
          {
            user?.isAdmin && (
            <Link to="admin-dashboard" onClick={()=> setToggle(false)} className="nav-link">
              <BsFillPersonCheckFill/>  Admin Dashboard
            </Link>
            )
          }
          
          
          
        </ul>
      </nav>
      <div className="header-right">
        {
          user ? <>
            <div  className="header-right-user-info">
              <span onClick={()=>setDropdown(prev => !prev)} className="header-right-username">
                {
                  user?.username
                }
              </span>
              <img src={user?.profilePhoto.url} alt="user photo" className="header-right-user-photo" />
              { dropdown &&(
                <div className="header-right-dropdown">
                  <Link onClick={()=>setDropdown(false)} to={`/profile/${user?._id}`} className="header-dropdown-item">
                  <BsFillFilePersonFill/>
                  <span>Profile</span>
                  </Link>
                  <div onClick={logoutHandler} className="header-dropdown-item">
                    <AiFillCaretLeft/>
                    <span>Logout</span>
                  </div>
                </div>
              )
                  
              }
            
            </div>
          </> : (
            <>
            <Link to="/login" className="header-right-link">
            <BsBoxArrowRight/>
          <span>Login</span>
        </Link>
        
        <Link to="/register" className="header-right-link">
            <BsFillPersonPlusFill/>
          <span>Register</span>
        </Link>
            </>
          )
        }
      </div>
    </header>
  );
};

export default Header;
