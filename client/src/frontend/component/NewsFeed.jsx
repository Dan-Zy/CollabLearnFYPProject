// eslint-disable-next-line no-unused-vars
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
import jwt_decode from "jwt-decode"; // Import jwt-decode

export function PostCall() {
  const [PostData, setPostData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const userid = jwt_decode(token); 
        
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "http://localhost:3001/collablearn/user/getPosts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `${token}`, // Include token in the headers
            },
          }
        );

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
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
              UserImg: post.userId.profilePicture
                ? `http://localhost:3001/${post.userId.profilePicture}`
                : img,
              name: post.userId.username,
              time: new Date(post.createdAt).toLocaleString(),
              text: post.content,
              img: post.image ? `http://localhost:3001/${post.image}` : "",
              document: documentUrl,
              documentName: documentName,
              video: post.video ? `http://localhost:3001/${post.video}` : "",
              upvote: post.upvotes.length,
              devote: post.devotes.length,
              share: post.shares.length,
              comment: post.comments.length,
              userUpvoted: post.upvotes.includes(userid.id),
              userDevoted: post.devotes.includes(userid.id), // Add this to check if the user has upvoted
            };
          })
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
        navigate("/"); // Redirect to login page if unauthorized
      }
    };

    fetchPosts();
  }, [navigate]);

  const extractDocumentName = (filePath) => {
    const fileName = filePath.split("\\").pop();
    const namePart = fileName.split("-Q-D-H-T-E-")[0];
    const extension = fileName.split(".").pop();
    return `${namePart}.${extension}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {error && <div className="text-red-500">{error}</div>}
      {PostData.map((postdetail, index) => (
        <Post key={index} postdetail={postdetail} />
      ))}
    </div>
  );
}

export function Post(props) {
  const postdetail = props.postdetail;
  const [upvote, setUpvote] = useState(postdetail.upvote);
  const [checked, setChecked] = useState(postdetail.userUpvoted);
  const [devote, setDevote] = useState(postdetail.devote);
  const [checkedDevote, setCheckedDevote] = useState(postdetail.userDevoted);

  const handleUpvote = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }

    try {
      const url = checked
        ? `http://localhost:3001/collablearn/user/removePostUpvote/${postId}`
        : `http://localhost:3001/collablearn/user/upvotePost/${postId}`;
      const method = checked ? "put" : "post";

      const res = await axios[method](url, {}, {
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
    } catch (error) {
      console.log("Failed to update upvote status:", error);
    }
  };

  const handleDevote =async (postId) => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }
    try {
      const url = checkedDevote
        ? `http://localhost:3001/collablearn/user/removePostDevote/${postId}`
        : `http://localhost:3001/collablearn/user/devotePost/${postId}`;
      const method = checkedDevote ? "put" : "post";

      const res = await axios[method](url, {}, {
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
    } catch (error) {
      console.log("Failed to update Devote status:", error);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-lg rounded-lg p-4 my-4">
      <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
        <img
          src={postdetail.UserImg}
          className="w-12 h-12 rounded-full border border-indigo-500"
        />
        <div className="ml-4">
          <div className="font-bold text-lg">{postdetail.name}</div>
          <div className="text-gray-500 text-sm">{postdetail.time}</div>
        </div>
        <img src={img2} className="ml-auto w-6 h-6" />
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
          <img src={share} className="w-6 h-6" />
          <span>{postdetail.share}</span>
        </div>
      </div>
    </div>
  );
}
