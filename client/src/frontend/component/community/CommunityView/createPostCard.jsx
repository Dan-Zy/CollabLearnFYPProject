import React, { useState } from 'react';
import dco from "../../../../assets/image (7).png";
import img from "../../../../assets/image_icon.png";
import emo from "../../../../assets/emoji_icon.png";

function PostCard({ communityId, onClose }) {
  console.log('====================================');
  console.log({communityId});
  console.log('====================================');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [privacy, setPrivacy] = useState('public');

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    if (fileType === "image") {
      setImageFile(file);
    } else if (fileType === "video") {
      setVideoFile(file);
    } else if (fileType === "pdf") {
      setPdfFile(file);
    }
  };

  const handleFileRemove = (fileType) => {
    if (fileType === "image") {
      setImageFile(null);
    } else if (fileType === "video") {
      setVideoFile(null);
    } else if (fileType === "pdf") {
      setPdfFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      try {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append("content", trimmedText);
        if (imageFile) formData.append("image", imageFile);
        if (videoFile) formData.append("video", videoFile);
        if (pdfFile) formData.append("document", pdfFile);
        formData.append("communityId", communityId);
        
        const response = await fetch(`http://localhost:3001/collablearn/uploadCommunityPost/${communityId}`, {
          method: "POST",
          headers: {
            Authorization: `${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          alert("Post uploaded successfully");
          setText('');
          setImageFile(null);
          setVideoFile(null);
          setPdfFile(null);
          onClose();
        } else {
          alert("Failed to upload post: " + data.message);
        }
      } catch (error) {
        console.error("Error uploading post:", error);
        alert("Error uploading post");
      }
    }
  };

  return (
    <div className="flex-1 w-[60vw] bg-white p-6 rounded-lg shadow-lg  max-w-2xl">
      <form onSubmit={handleSubmit} className='flex-1'>
        <div className="mb-4 ">
          <textarea
            placeholder="Write something"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
          {imageFile && (
            <div className="relative mt-4">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Attachment"
                className="w-full h-auto max-h-80 object-contain rounded-lg"
              />
              <button
                onClick={() => handleFileRemove("image")}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                &times;
              </button>
            </div>
          )}
          {videoFile && (
            <div className="relative mt-4">
              <video
                controls
                src={URL.createObjectURL(videoFile)}
                alt="Attachment"
                className="w-full h-auto max-h-80 object-contain rounded-lg"
              />
              <button
                onClick={() => handleFileRemove("video")}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                &times;
              </button>
            </div>
          )}
          {pdfFile && (
            <div className="relative mt-4">
              <embed
                src={URL.createObjectURL(pdfFile)}
                type="application/pdf"
                className="w-full h-auto max-h-80 object-contain rounded-lg"
              />
              <button
                onClick={() => handleFileRemove("pdf")}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                &times;
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="file"
                id="fileInput1"
                className="hidden"
                accept=".jpg,.png"
                onChange={(e) => handleFileChange(e, "image")}
              />
              <label htmlFor="fileInput1" className="cursor-pointer">
                <img src={img} alt="Upload" className="w-8 h-8" />
              </label>
            </div>
            <div className="relative">
              <input
                type="file"
                id="fileInput2"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, "pdf")}
              />
              <label htmlFor="fileInput2" className="cursor-pointer">
                <img src={dco} alt="Upload" className="w-8 h-8" />
              </label>
            </div>
            <div className="relative">
              <input
                type="file"
                id="fileInput3"
                className="hidden"
                accept=".mp4"
                onChange={(e) => handleFileChange(e, "video")}
              />
              <label htmlFor="fileInput3" className="cursor-pointer">
                <img src={emo} alt="Upload" className="w-8 h-8" />
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostCard;
