import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PostCall } from '../UserProfile/userPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function OtherUserProfile({ userId, type, onGoBack }) {  
  
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postStats, setPostStats] = useState({ totalPosts: 0, totalUpvotes: 0, totalDevotes: 0 });
  const [collablers, setCollablers] = useState([]);
  const [showCollablersList, setShowCollablersList] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        // Fetch user information
        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setUserInfo(userInfoResponse.data.user);

        // Fetch collablers
        const collablersResponse = await axios.get(
          `http://localhost:3001/collablearn/getAllCollablers/${userId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setCollablers(collablersResponse.data.collablers);

        const postsResponse = await fetch(
          "http://localhost:3001/collablearn/user/getPosts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const postsData = await postsResponse.json();
        const allPosts = postsData.posts || [];
        
        const userPosts = allPosts.filter((post) => post.userId?._id === userId);
        const totalUpvotes = userPosts.reduce((acc, post) => acc + (post.upvotes.length || 0), 0);
        const totalDevotes = userPosts.reduce((acc, post) => acc + (post.devotes.length || 0), 0);

        setPosts(userPosts);
        setPostStats({ totalPosts: userPosts.length, totalUpvotes, totalDevotes });
      
      } catch (error) {
        console.error("Error fetching user info or posts:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleActionClick = async (e) => {
    e.stopPropagation();
    let endpoint, method;

    switch (type) {
      case 'suggested':
        endpoint = `/sendCollabRequest/${userId}`;
        method = 'post';
        break;
      case 'received':
        endpoint = `/acceptCollabRequest/${userId}`;
        method = 'put';
        break;
      case 'collaborator':
        endpoint = `/deleteCollabler/${userId}`;
        method = 'put';
        break;
      default:
        console.error('Unknown type:', type);
        return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios({
        method: method,
        url: `http://localhost:3001/collablearn${endpoint}`,
        headers: {
          Authorization: `${token}`,
        },
      });
      // Handle action result (e.g., updating state)
    } catch (error) {
      console.error(`Error handling action for type ${type}:`, error);
    }
  };

  const renderButton = () => {
    switch (type) {
      case 'suggested':
        return (
          <button 
            className="bg-indigo-500 text-white px-4 py-1 rounded-full mt-2"
            onClick={handleActionClick}
          >
            Send Request
          </button>
        );
      case 'received':
        return (
          <button
            className="bg-indigo-500 text-white px-4 py-1 rounded-full"
            onClick={handleActionClick}
          >
            Accept Request
          </button>
        );
      case 'collaborator':
        return (
          <button 
            className="bg-indigo-500 text-white px-1 py-1 rounded-full mt-2"
            onClick={handleActionClick}
          >
            Remove
          </button>
        );
      default:
        return null;
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='flex'>
        <button 
          className="bg-indigo-500 text-white px-2 py-1 rounded-full flex items-center" 
          onClick={onGoBack}  // Call the onGoBack function
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Icon */}
          Go Back
        </button>
      </div>

      <div className="max-w-5xl max-h-[54vh] mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
        {/* Profile Header */}
        <div className="relative">
          <img
            src={userInfo.coverPicture ? `http://localhost:3001/${userInfo.coverPicture}` : 'https://via.placeholder.com/600x200'}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-6 left-6 transform translate-y-1/2">
            <img
              src={userInfo.profilePicture ? `http://localhost:3001/${userInfo.profilePicture}` : 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          </div>
          <div className="absolute bottom-0 left-32 p-0">
            <h1 className="text-xl font-bold text-left">{userInfo.username}</h1>
            <p className="text-gray-600 font-extralight text-xs text-left">{userInfo.email}</p>
          </div>
        </div>

        <div className="flex justify-around mt-5 text-center">
          <div>
            <h2 className="text-lg font-bold">Posts</h2>
            <p>{postStats.totalPosts}</p>
          </div>
          <div 
            className="relative"
            onMouseEnter={() => setShowCollablersList(true)}
            onMouseLeave={() => setShowCollablersList(false)}
          >
            <h2 className="text-lg font-bold">Collablers</h2>
            <p>{collablers.length}</p>
            {showCollablersList && (
              <div className="absolute top-full w-[20vw] h-[30vh] overflow-y-auto shadow-xl left-0 mt-2 bg-white border rounded p-4 z-10">
                {collablers.length === 0 ? (
                  <p>No collablers yet</p>
                ) : (
                  collablers.map(collabler => (
                    <div key={collabler._id} className="flex w-full items-center justify-between flex-1 shadow-lg p-2 mb-2">
                      <div className="flex items-center">
                        <img src={`http://localhost:3001/${collabler.img}`} alt={collabler.name} className="w-8 h-8 rounded-full mr-2" />
                        <span>{collabler.name}</span>
                      </div>
                      <button 
                        className="text-indigo-500 rounded-full hover:text-red-700"
                        onClick={() => handleRemoveCollabler(collabler._id)}
                      >
                        &#x2716; 
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">Upvotes</h2>
            <p>{postStats.totalUpvotes}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Devotes</h2>
            <p>{postStats.totalDevotes}</p>
          </div>
          {renderButton()}
        </div>

        <div className="flex flex-col w-full md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="mt-4 text-indigo-500">
            <div className="flex-1 text-left md:w-full bg-gradient-to-tr from-indigo-200 to-indigo-100 p-2 rounded-xl shadow-">
              <h2 className="text-lg font-bold mb-4">About Me</h2>
              {renderRoleSpecificInfo(userInfo)}
            </div>
          </div>
          <div className="flex flex-1">
            <PostCall userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
}

const renderRoleSpecificInfo = (userInfo) => {
    
  if (userInfo.role === 'Student') {
    return (
      <ul className="w-full justify-center items-center text-gray-700">
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold text-s">Current Academic Status: </span>
          {userInfo.studentDetails.currentAcademicStatus}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Major: </span>
          {userInfo.studentDetails.major}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Degree: </span>
          {userInfo.studentDetails.degree}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Interested Subjects: </span>
          {userInfo.studentDetails.interestedSubjects.join(', ')}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Institution: </span>
          {userInfo.studentDetails.institution}
        </li>
      </ul>
    );
  } else if (userInfo.role === 'Faculty') {
    return (
      <ul className="space-y-2 text-gray-700">
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Current Academic Status: </span>
          {userInfo.facultyDetails.highestQualification}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Major: </span>
          {userInfo.facultyDetails.lastDegreeMajor}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Degree: </span>
          {userInfo.facultyDetails.degree}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Current Teaching: </span>
          {userInfo.facultyDetails.coursesCurrentlyTeaching.join(', ')}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Research Interset: </span>
          {userInfo.facultyDetails.researchInterests.join(', ')}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Institution: </span>
          {userInfo.facultyDetails.institution}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Position: </span>
          {userInfo.facultyDetails.academicPosition}
        </li>
      </ul>
    );
  } else if (userInfo.role === 'Industrial') {
    return (
      <ul className="space-y-2 text-gray-700">
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Profession: </span>
          {userInfo.industrialDetails.profession}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Designation: </span>
          {userInfo.industrialDetails.designation}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Currently Working At: </span>
          {userInfo.industrialDetails.currentlyWorkingAt}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Years of Experience: </span>
          {userInfo.industrialDetails.yearsOfExperience}
        </li>
        <li className="flex flex-row text-s">
          <span className="flex-1 font-semibold">Interested Subjects: </span>
          {userInfo.industrialDetails.interestedSubjects.join(', ')}
        </li>
      </ul>
    );
  } else {
    return <p>Role not recognized</p>;
  }
};