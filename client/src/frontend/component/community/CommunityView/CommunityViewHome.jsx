import React from 'react';
import CoverPhoto from'./CoverPhoto'
import Header from './Header';
import NavBar from './NavBar';
//import { PostCall } from'../Post/Post';

function CommunityViewHome({CommunityId}) {
  return (
    <div className=" flex flex-col items-center">
    <CoverPhoto />
    <Header />
    <NavBar name="/CommunityHome" />
    <button className="CH-CP-btn text-indigo-600 border border-indigo-600 rounded-full px-4 py-2 mt-2">Create Post</button>
  {/* <PostCall /> */}
  </div>
  
  );
}

export default CommunityViewHome;
