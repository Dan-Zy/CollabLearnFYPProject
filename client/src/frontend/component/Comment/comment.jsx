import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import com from "../../../assets/comment_icon.png";
import userIcon from "../../../assets/person_icon.png";
import send from "../../../assets/send_icon.png";
import UV from "../../../assets/upvote_icon.png";
import DV from "../../../assets/devote_icon.png";

function Comment({ postId }) { // Added token as a prop
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = async () => {
    const token = localStorage.getItem('token');
    setIsModalOpen(true);
    alert(postId);
    try {
      const res = await axios.get(`http://localhost:3001/collablearn/user/getComments/${postId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      setComments(res.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:3001/collablearn/user/addComment/${postId}`, 
         newComment , 
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      setComments([...comments, res.data.comment]);
      setNewComment('');
      alert([...comments, res.data.comment]);
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
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
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={comment.image || userIcon}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold">{comment.userId.username}</h4>
                    </div>
                  </div>
                  <div className="flex justify-center items-left text-left w-full">
                    <p className="w-[80%] mt-1 p-2 text-sm text-white bg-indigo-400 rounded-lg">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex flex-row justify-normal ml-10">
                    <div className="flex flex-row items-center mr-5">
                      <img src={UV} className="w-4 h-4 cursor-pointer" alt="Upvote Icon" />
                      <span className="text-sm ml-1">{comment.upvotes.length}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <img src={DV} className="w-4 h-4 cursor-pointer" alt="Downvote Icon" />
                      <span className="text-sm ml-1">{comment.devotes.length}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                value={newComment}
                onChange={handleCommentChange}
                className="ml-3 flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <img
                src={send}
                className="w-6 h-6 ml-3 cursor-pointer"
                alt="Send Icon"
                onClick={handleCommentSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Comment;
