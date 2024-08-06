import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/person_icon.png";
import img2 from "../../../assets/options.png";
import UV from "../../../assets/upvote_icon.png";
import DV from "../../../assets/devote_icon.png";
import share from "../../../assets/share_icon.png";
import docImg from "../../../assets/pdf_icon.png";
import Comment from "./comment";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function PostCall({userId}) {
  const [PostData, setPostData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
  
        const userid = jwt_decode(token);
  
        const response = await fetch(
          "http://localhost:3001/collablearn/user/getPosts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
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
       
        const filteredPosts = data.posts.filter(post => post.userId?._id === userId);
        

        setPostData(
          filteredPosts.map((post) => {
            const documentUrl = post.document ? `http://localhost:3001/${post.document}` : "";
            const documentName = post.document ? extractDocumentName(post.document) : "";
            return {
              postId: post._id,
              UserImg: post.userId?.profilePicture ? `http://localhost:3001/${post.userId.profilePicture}` : img,
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
              userUpvoted: post.upvotes?.includes(userid.id) || false,
              userDevoted: post.devotes?.includes(userid.id) || false,
              originalAuthor:  post.originalAuthor,
              shared: !!post.sharedPost,
              isOwner: post.userId?._id === userid.id,
            };
          })
        );
  
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
        navigate("/");
      }
    };
  
    fetchPosts();
  }, [navigate, userId]); // Add userId as a dependency
  

  const extractDocumentName = (filePath) => {
    const fileName = filePath.split("\\").pop();
    const namePart = fileName.split("-Q-D-H-T-E-")[0];
    const extension = fileName.split(".").pop();
    return `${namePart}.${extension}`;
  };

  const handleDeletePostFromUI = (postId) => {
    setPostData(PostData.filter((post) => post.postId !== postId));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {error && <div className="text-red-500">{error}</div>}
      {PostData.map((postdetail, index) => (
        <Post key={index} postdetail={postdetail} onDelete={handleDeletePostFromUI} />
      ))}
      <ToastContainer />
    </div>
  );
}

export function Post(props) {
  const postdetail = props.postdetail;
  const [upvote, setUpvote] = useState(postdetail.upvote);
  const [checked, setChecked] = useState(postdetail.userUpvoted);
  const [devote, setDevote] = useState(postdetail.devote);
  const [checkedDevote, setCheckedDevote] = useState(postdetail.userDevoted);
  const [showOptions, setShowOptions] = useState(false);

  const handleUpvote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }
  
    const updateUpvote = async () => {
      const url = checked
        ? `http://localhost:3001/collablearn/user/removePostUpvote/${postId}`
        : `http://localhost:3001/collablearn/user/upvotePost/${postId}`;
      const method = checked ? "put" : "post";
  
      await axios[method](url, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      if (checked) {
        setUpvote(upvote - 1);
      } else {
        setUpvote(upvote + 1);
      }
      setChecked(!checked);
    };
  
    toast.promise(updateUpvote(), {
      pending: 'Processing...',
      success: 'Upvote updated successfully!',
      error: 'Failed to update upvote status',
    });
  };
  

  const handleDevote = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }
  
    const updateDevote = async () => {
      const url = checkedDevote
        ? `http://localhost:3001/collablearn/user/removePostDevote/${postId}`
        : `http://localhost:3001/collablearn/user/devotePost/${postId}`;
      const method = checkedDevote ? "put" : "post";
  
      await axios[method](url, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      if (checkedDevote) {
        setDevote(devote - 1);
      } else {
        setDevote(devote + 1);
      }
      setCheckedDevote(!checkedDevote);
    };
  
    toast.promise(updateDevote(), {
      pending: 'Processing...',
      success: 'Devote updated successfully!',
      error: 'Failed to update devote status',
    });
  };
  

  const handleShare = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }
    const sharedContent = '';
  
    if (window.confirm("Do you want to share this post?")) {
      const sharePost = async () => {
        const res = await axios.post(
          `http://localhost:3001/collablearn/user/sharePost/${postId}`,
          { sharedContent },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
  
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
      };
  
      toast.promise(sharePost(), {
        pending: 'Processing...',
        success: 'Post has been shared successfully!',
        error: 'Error sharing the post',
      });
    }
  };
  

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
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
          toast.success("Post has been deleted successfully!");
          props.onDelete(postId); // Remove post from UI
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error deleting the post:", error);
        toast.error("Error deleting the post");
      }
    }
  };

  const handleEditPost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }

    if (window.confirm("Do you want to edit this post?")) {
      try {
        const res = await axios.put(
          `http://localhost:3001/collablearn/user/deletePost/${postId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.data.success) {
          toast.success("Post has been edited successfully!");
          props.onDelete(postId); // Remove post from UI
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error editing the post:", error);
        toast.error("Error editing the post");
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
    <div className="flex  flex-col w-full sm:w-full md:w-full lg:w-full xl:w-full bg-white shadow-lg rounded-lg p-4 my-4">
      <div className="flex  items-center border-b border-gray-300 pb-2 mb-4">
        <img
          src={postdetail.UserImg}
          className="w-12 h-12 rounded-full border border-indigo-500"
        />
        <div className="ml-4">
          <div className="font-bold flex justify-start text-left items-start text-s">
            {postdetail.originalAuthor ? (
              <span className="tooltip ">
                {truncateText(postdetail.name, 15)}
                <span className="pl-1 pr-1 mt-1.5 text-[9px] opacity-50">{" shared from"}</span>
                <span className="text-[9px] mt-1.5">{truncateText(postdetail.originalAuthor, 10)}</span>
                <span className="tooltiptext">
                  The Original Author {postdetail.originalAuthor}
                </span>
              </span>
            ) : (
              postdetail.name
            )}
          </div>
          <div className="text-gray-500 text-sm text-left">{postdetail.time}</div>
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
              <button
                className="flex w-[5vw] mb-1 h-8 text-center justify-center items-center bg-[#d5deff] text-[#8489d8] hover:bg-gray-200"
                disabled={!postdetail.isOwner}
                onClick={() => handleEditPost(postdetail.postId)}
              >
                Edit Post
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
              className="w-full max-w-lg h-auto rounded-lg"
            />
          </div>
        )}
        {postdetail.video && (
          <div className="mt-4 flex justify-center">
            <video
              controls
              src={postdetail.video}
              className="w-full max-w-lg h-auto rounded-lg"
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
