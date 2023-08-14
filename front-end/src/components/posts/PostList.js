import React from 'react';
import PostItem from './PostItem';
import './posts.css'


const PostList = ({posts}) => {
  return (
    <div className="post-list">
      {
      posts.map((post)=><PostItem post={post} key={post._id}/>)
      }
    </div>
  );
}

export default PostList;
