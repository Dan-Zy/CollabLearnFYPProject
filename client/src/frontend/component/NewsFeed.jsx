import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/person_icon.png";
import img2 from "../../assets/options.png";
import UV from "../../assets/upvote_icon.png";
import DV from "../../assets/devote_icon.png";
import share from "../../assets/share_icon.png";
import docImg from "../../assets/pdf_icon.png";
import Comment from "./Comment/comment";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Notification from "./SystemNotification"; 
import UserCard from "./RecommendUserCard";

export function PostCall() {
  const [PostData, setPostData] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo"))); // Load userInfo from localStorage
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOriginalInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${userInfo._id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.data) {
          setUserInfo(response.data.user); // Update userInfo state
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setNotification({
          message: "Failed to fetch user info",
          type: "error",
        });
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3001/collablearn/user/getPosts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.posts) {
          throw new Error("No posts found");
        }

        setPostData(
          data.posts.map((post) => {
            const documentUrl = post.document
              ? `http://localhost:3001/${post.document}`
              : "";
            const documentName = post.document
              ? extractDocumentName(post.document)
              : "";
            return {
              postId: post._id,
              UserImg: post.userId?.profilePicture
                ? `http://localhost:3001/${post.userId.profilePicture}`
                : img,
              name: post.userId?.username || "Unknown User",
              time: new Date(post.createdAt).toLocaleString(),
              text: post.content,
              img: post.image ? `http://localhost:3001/${post.image}` : "",
              document: documentUrl,
              documentName: documentName,
              video: post.video ? `http://localhost:3001/${post.video}` : "",
              upvote: post.upvotes?.length || 0,
              devote: post.devotes?.length || 0,
              share: post.shares?.length || 0,
              comment: post.comments?.length || 0,
              userUpvoted: post.upvotes?.includes(userInfo._id) || false,
              userDevoted: post.devotes?.includes(userInfo._id) || false,
              originalAuthor: post.originalAuthor,
              shared: !!post.sharedPost,
              isOwner: post.userId?._id === userInfo._id,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
        setNotification({ message: "Error fetching posts", type: "error" });
        navigate("/");
      }
    };

    const fetchRecommendedUsers = async () => {
      try {
        console.log("User Role:", userInfo.role); // Ensure role is accessed correctly
        
        const postData = new FormData();
        postData.append('n_recommendations', 6);
        
        if (userInfo.role === 'Student') {
          postData.append('Role', userInfo.role);
          postData.append('Degree', userInfo.studentDetails.currentAcademicStatus);
          postData.append('Subject', userInfo.studentDetails.degreeSubject);
          userInfo.studentDetails.interestedSubjects.forEach(interest => postData.append('Interests', interest));
        } else if (userInfo.role === 'Faculty') {
          postData.append('Role', userInfo.role);
          postData.append('Degree', userInfo.facultyDetails.highestQualification);
          postData.append('Subject', userInfo.facultyDetails.degreeSubject);
          userInfo.facultyDetails.interestedSubjects.forEach(interest => postData.append('Interests', interest));
        } else if (userInfo.role === 'Industrial') {
          postData.append('Role', userInfo.role);
          postData.append('Degree', userInfo.industrialDetails.highestQualification);
          postData.append('Subject', userInfo.industrialDetails.degreeSubject);
          userInfo.industrialDetails.interestedSubjects.forEach(interest => postData.append('Interests', interest));
        }
        
        console.log("FormData entries:", ...postData.entries());
        
        const recommendationResponse = await axios.post("http://127.0.0.1:5000/recommend", postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        const userIds = recommendationResponse.data.recommendations[0].users;
        console.log("Recommended User IDs:", userIds);
        const token = localStorage.getItem("token");
    
        const userDetailPromises = userIds.map(userId => {
          console.log("Fetching details for User ID:", userId);  // Log userId here
          return axios.get(`http://localhost:3001/collablearn/user/getUser/${userId}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
        });
    
        const userDetails = await Promise.all(userDetailPromises);
        console.log("Fetched User Details:", userDetails);
    
        const filteredUsers = userDetails.filter(userDetail =>
          userInfo._id.toString() !== userDetail.data.user._id.toString() &&
          !userInfo.collablers.includes(userDetail.data.user._id.toString()) &&
          !userInfo.sendedRequests.includes(userDetail.data.user._id.toString()) &&
          !userInfo.receivedRequests.some(req => req.user.toString() === userDetail.data.user._id.toString())
        );
    
        setRecommendedUsers(filteredUsers.map(response => response.data.user));
      } catch (error) {
        console.error("Error fetching recommended users:", error.response?.data || error.message || error);
        setError("Error fetching recommended users");
        setNotification({ message: "Error fetching recommended users", type: "error" });
      }
    };
    
    

    fetchOriginalInfo().then(() => {
      fetchPosts();
      fetchRecommendedUsers(); 
    });
  }, [navigate, userInfo]); // Added userInfo as a dependency

  const extractDocumentName = (filePath) => {
    const fileName = filePath.split("\\").pop();
    const namePart = fileName.split("-Q-D-H-T-E-")[0];
    const extension = fileName.split(".").pop();
    return `${namePart}.${extension}`;
  };

  const handleDeletePostFromUI = (postId) => {
    setPostData(PostData.filter((post) => post.postId !== postId));
  };

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };

  const handleMouseScroll = (event) => {
    const container = event.currentTarget;
    if (event.deltaY !== 0) {
      container.scrollLeft += event.deltaY;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      {error && <div className="text-red-500">{error}</div>}

      <div
        className="relative w-[90%] mt-10 flex overflow-x-auto space-x-4 mb-4 scrollbar-hide"
        onWheel={handleMouseScroll}
      >
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 z-10 bg-gray-200 rounded-full"
          onClick={() => document.getElementById('recommend-container').scrollBy({ left: -200, behavior: 'smooth' })}
        >
          &lt;
        </button>
        <div id="recommend-container" className="flex flex-col shadow-xl bg-indigo-200 w-full rounded-lg p-5 space-x-4 overflow-x-auto no-scrollbar">
          <div className="text-xl font-bold text-indigo-500">
            <h1>Recommanded Users</h1>
          </div>
          <div className="flex  w-full rounded-lg p-5 space-x-4 overflow-x-auto no-scrollbar ">
            {recommendedUsers.map((user, index) => (
              <UserCard
                key={index}
                profilePicture={`http://localhost:3001/${user.profilePicture}`}
                username={user.username}
                userId={user._id}
                role={user.role}
              />
            ))}
          </div>
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 z-10 bg-gray-200 rounded-full"
          onClick={() => document.getElementById('recommend-container').scrollBy({ left: 200, behavior: 'smooth' })}
        >
          &gt;
        </button>
      </div>

      {PostData.map((postdetail, index) => (
        <Post
          key={index}
          postdetail={postdetail}
          onDelete={handleDeletePostFromUI}
          setNotification={setNotification} 
        />
      ))}
    </div>
  );
}


// The Post component remains unchanged.
export function Post(props) {
  const postdetail = props.postdetail;
  const [upvote, setUpvote] = useState(postdetail.upvote);
  const [checked, setChecked] = useState(postdetail.userUpvoted);
  const [devote, setDevote] = useState(postdetail.devote);
  const [checkedDevote, setCheckedDevote] = useState(postdetail.userDevoted);
  const [showOptions, setShowOptions] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [originalAuthorInfo, setOriginalAuthorInfo] = useState(null);

  useEffect(() => {
    if (postdetail.originalAuthor) {
      fetchOriginalAuthorInfo(postdetail.originalAuthor);
    }
  }, [postdetail.originalAuthor]);

  const fetchOriginalAuthorInfo = async (authorId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `http://localhost:3001/collablearn/user/getUser/${authorId._id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data) {
        setOriginalAuthorInfo(response.data.user);
      } else {
        throw new Error("Failed to fetch original author info");
      }
    } catch (error) {
      console.error("Error fetching original author info:", error);
      props.setNotification({
        message: "Failed to fetch original author info",
        type: "error",
      });
    }
  };

  const handleUpvote = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.setNotification({ message: "No token found", type: "error" });
      return;
    }

    try {
      const url = checked
        ? `http://localhost:3001/collablearn/user/removePostUpvote/${postId}`
        : `http://localhost:3001/collablearn/user/upvotePost/${postId}`;
      const method = checked ? "put" : "post";

      await axios[method](url, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setUpvote(checked ? upvote - 1 : upvote + 1);
      setChecked(!checked);
      props.setNotification({
        message: "Upvote updated successfully!",
        type: "success",
      });
    } catch (error) {
      props.setNotification({
        message: "Failed to update upvote status",
        type: "error",
      });
      console.error("Error updating upvote:", error);
    }
  };

  const handleDevote = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.setNotification({ message: "No token found", type: "error" });
      return;
    }

    try {
      const url = checkedDevote
        ? `http://localhost:3001/collablearn/user/removePostDevote/${postId}`
        : `http://localhost:3001/collablearn/user/devotePost/${postId}`;
      const method = checkedDevote ? "put" : "post";

      await axios[method](url, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setDevote(checkedDevote ? devote - 1 : devote + 1);
      setCheckedDevote(!checkedDevote);
      props.setNotification({
        message: "Devote updated successfully!",
        type: "success",
      });
    } catch (error) {
      props.setNotification({
        message: "Failed to update devote status",
        type: "error",
      });
      console.error("Error updating devote:", error);
    }
  };

  const handleShare = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.setNotification({ message: "No token found", type: "error" });
      return;
    }

    if (window.confirm("Do you want to share this post?")) {
      try {
        const res = await axios.post(
          `http://localhost:3001/collablearn/user/sharePost/${postId}`,
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.data.success) {
          props.setNotification({
            message: "Post shared successfully!",
            type: "success",
          });
        } else {
          throw new Error(res.data.message);
        }
      } catch (error) {
        props.setNotification({
          message: "Failed to share post",
          type: "error",
        });
        console.error("Error sharing post:", error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.setNotification({ message: "No token found", type: "error" });
      return;
    }

    if (window.confirm("Do you want to delete this post?")) {
      try {
        const res = await axios.delete(
          `http://localhost:3001/collablearn/user/deletePost/${postId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.data.success) {
          props.setNotification({
            message: "Post has been deleted successfully!",
            type: "success",
          });
          props.onDelete(postId); // Remove post from UI
        } else {
          props.setNotification({
            message: res.data.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting the post:", error);
        props.setNotification({
          message: "Error deleting the post",
          type: "error",
        });
      }
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="flex flex-col w-[80%] sm:w-full md:w-full lg:w-[80%] xl:w-[80%] bg-white shadow-lg rounded-lg p-4 my-4">
      <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
        <img
          src={postdetail.UserImg}
          className="w-12 h-12 rounded-full border border-indigo-500"
        />
        <div className="ml-4">
          <div className="font-bold flex justify-start text-left items-start text-s">
            {postdetail.originalAuthor && originalAuthorInfo ? (
              <span
                className="relative tooltip-container"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                {truncateText(postdetail.name, 15)}
                <span className="pl-1 pr-1 mt-1.5 text-[9px] opacity-50">
                  {" shared from"}
                </span>
                <span className="text-[9px] mt-1.5">
                  {truncateText(originalAuthorInfo.username, 15)}
                </span>

                {tooltipVisible && originalAuthorInfo && (
                  <span className="absolute left-0 bottom-full mb-2 w-full bg-indigo-200 text-indigo-500 text-xs rounded py-1 px-2 z-10">
                    Original Author: {originalAuthorInfo.username} <br />
                    Email: {originalAuthorInfo.email}
                  </span>
                )}
              </span>
            ) : (
              postdetail.name
            )}
          </div>
          <div className="text-gray-500 text-sm text-left">
            {postdetail.time}
          </div>
        </div>
        <div className="ml-auto relative">
          <img
            src={img2}
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="absolute right-0.1 mt-1 p-1 text-[10px] border-[#d5deff] border rounded-lg shadow-lg">
              <button
                className="flex w-[5vw] mb-1 h-8 text-center justify-center items-center bg-[#d5deff] text-[#8489d8] hover:bg-gray-200"
                disabled={!postdetail.isOwner}
                onClick={() => handleDeletePost(postdetail.postId)}
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-lg">{postdetail.text}</div>
        {postdetail.img && (
          <div className="mt-4 flex justify-center">
            <img
              src={postdetail.img}
              alt=""
              className="w-full max-w-[50vw] h-[50vh] rounded-lg"
            />
          </div>
        )}
        {postdetail.video && (
          <div className="mt-4 flex justify-center">
            <video
              controls
              src={postdetail.video}
              className="w-full max-w-[50vw] h-[50vh] rounded-lg"
            />
          </div>
        )}
        {postdetail.document && (
          <div className="mt-4 flex justify-center">
            <a
              href={postdetail.document}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center border rounded-lg p-2 w-64 bg-gray-100 hover:bg-gray-200"
            >
              <img src={docImg} alt="Document" className="w-12 h-12 mb-2" />
              <span className="text-center">{postdetail.documentName}</span>
            </a>
          </div>
        )}
      </div>
      <div className="flex items-center justify-around border-t border-gray-300 pt-2">
        <div className="flex items-center space-x-2">
          <img
            src={UV}
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleUpvote(postdetail.postId)}
          />
          <span>{upvote}</span>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={DV}
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleDevote(postdetail.postId)}
          />
          <span>{devote}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Comment postId={postdetail.postId} />
          <span>{postdetail.comment}</span>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={share}
            className="w-6 h-6 cursor-pointer"
            onClick={() => handleShare(postdetail.postId)}
          />
          <span>{postdetail.share}</span>
        </div>
      </div>
    </div>
  );
}
