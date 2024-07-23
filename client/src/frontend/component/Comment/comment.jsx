import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import com from "../../../assets/comment_icon.png";
import userIcon from "../../../assets/person_icon.png";
import send from "../../../assets/send_icon.png";
import UV from "../../../assets/upvote_icon.png";
import DV from "../../../assets/devote_icon.png";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Comment({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(null); 

  const token = localStorage.getItem('token');
  let decodedToken;
  try {
    decodedToken = jwt_decode(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
  }

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setComments([]);
    try {
      const res = await axios.get(`http://localhost:3001/collablearn/user/getComments/${postId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      setComments(res.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, token]);

  useEffect(() => {
    if (isModalOpen) {
      fetchComments();
    }
  }, [isModalOpen, fetchComments]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCommentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    const submitComment = async () => {
      await axios.post(
        `http://localhost:3001/collablearn/user/addComment/${postId}`,
        { content },
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      setContent('');
      fetchComments();
    };

    toast.promise(submitComment(), {
      pending: 'Posting comment...',
      success: 'Comment posted successfully!',
      error: 'Failed to post comment',
    });

    setIsSubmitting(false);
  };

  const handleUpvoteComment = async (comment) => {
    if (!token) {
      toast.error("No token found");
      return;
    }

    const isUpvoted = comment.upvotes.includes(decodedToken.id);

    const updateUpvote = async () => {
      const url = isUpvoted
        ? `http://localhost:3001/collablearn/user/removeCommentUpvote/${comment.commentId}`
        : `http://localhost:3001/collablearn/user/upvoteComment/${comment.commentId}`;
      const method = isUpvoted ? "put" : "post";

      await axios[method](url, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });

      fetchComments();
    };

    toast.promise(updateUpvote(), {
      pending: 'Updating upvote...',
      success: 'Upvote updated successfully!',
      error: 'Failed to update upvote status',
    });
  };

  const handleDevoteComment = async (comment) => {
    if (!token) {
      toast.error("No token found");
      return;
    }

    const isDevoted = comment.devotes.includes(decodedToken.id);

    const updateDevote = async () => {
      const url = isDevoted
        ? `http://localhost:3001/collablearn/user/removeCommentDevote/${comment.commentId}`
        : `http://localhost:3001/collablearn/user/devoteComment/${comment.commentId}`;
      const method = isDevoted ? "put" : "post";

      await axios[method](url, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });

      fetchComments();
    };

    toast.promise(updateDevote(), {
      pending: 'Updating devote...',
      success: 'Devote updated successfully!',
      error: 'Failed to update devote status',
    });
  };

  const handleDeleteComment = async (commentId) => {
    const deleteComment = async () => {
      await axios.delete(`http://localhost:3001/collablearn/user/deleteComment/${commentId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      setComments((prevComments) => prevComments.filter(comment => comment.commentId !== commentId));
    };

    toast.promise(deleteComment(), {
      pending: 'Deleting comment...',
      success: 'Comment deleted successfully!',
      error: 'Failed to delete comment',
    });
  };

  const toggleOptions = (commentId) => {
    setShowOptions((prevShowOptions) => (prevShowOptions === commentId ? null : commentId));
  };

  return (
    <>
      <img
        src={com}
        className="w-6 h-6 cursor-pointer"
        onClick={openModal}
        alt="Comment Icon"
      />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 w-11/12 sm:w-3/4 lg:w-1/2 border border-gray-300 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Comments</h2>
              <span
                className="text-gray-500 cursor-pointer text-2xl"
                onClick={closeModal}
              >
                &times;
              </span>
            </div>

            <div className="bg-gray-100 p-6 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-500">No comments yet</div>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={comment.userId.profilePicture ? `http://localhost:3001/${comment.userId.profilePicture}` : userIcon}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="m-2 flex flex-col justify-start text-left items-start">
                          <h4 className="text-sm font-semibold">{comment.userId.username}</h4>
                          <p className="text-[7px]">{comment.createdAt}</p>
                        </div>
                      </div>
                      {comment.userId._id === decodedToken.id && (
                        <div className="relative">
                          <button className="text-gray-500 focus:outline-none" onClick={() => toggleOptions(comment.commentId)}>
                            <span>&#x2022;&#x2022;&#x2022;</span>
                          </button>
                          {showOptions === comment.commentId && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleDeleteComment(comment.commentId)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center items-left text-left w-full">
                      <p className="w-[80%] mt-1 p-2 text-sm text-white bg-indigo-400 rounded-lg">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex flex-row justify-normal ml-10">
                      <div className="flex flex-row items-center mr-5">
                        <img src={UV} className="w-4 h-4 cursor-pointer" alt="Upvote Icon" onClick={() => handleUpvoteComment(comment)} />
                        <span className="text-sm ml-1">{comment.upvotes.length}</span>
                      </div>
                      <div className="flex flex-row items-center">
                        <img src={DV} className="w-4 h-4 cursor-pointer" alt="Devote Icon" onClick={() => handleDevoteComment(comment)} />
                        <span className="text-sm ml-1">{comment.devotes.length}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 flex items-center border-t pt-3">
              <img
                src={userIcon}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="Write your comment..."
                value={content}
                onChange={handleCommentChange}
                className="ml-3 flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                disabled={isSubmitting}
              />
              <img
                src={send}
                className={`w-6 h-6 ml-3 cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                alt="Send Icon"
                onClick={handleCommentSubmit}
              />
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Comment;
