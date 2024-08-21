import React, { useState } from "react";
import cross from "../../../assets/cross_icon1.png";
import dco from "../../../assets/image (7).png";
import img from "../../../assets/image_icon.png";
import emo from "../../../assets/emoji_icon.png";
import user from "../../../assets/person_icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function CreatePostModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [textError, setTextError] = useState(""); // State to track error message

  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setTextError("Please write something before submitting."); // Set error message
      return;
    } else {
      setTextError(""); // Clear error message if there is text
    }

    setLoading(true); // Start loading

    const trimmedText = text.trim();

    try {
      const result = await query({ text: trimmedText });
      console.log("API Response:", result);

      setTimeout(() => {
        if (result.length > 0) {
          let maxScore = -1;
          let maxLabel = "";
          let toxicWords = [];

          result.forEach((item) => {
            if (item.score > maxScore) {
              maxScore = item.score;
              maxLabel = item.label;
            }
            if (item.label !== "LABEL_0") {
              toxicWords.push(item.word); // Collect toxic words
            }
          });

          if (maxLabel === "LABEL_0") {
            toast.success("Post is appropriate. Proceeding with submission.");

            // Proceed with form submission
            console.log({
              text: trimmedText,
              imageFile,
              videoFile,
              pdfFile,
              privacy,
            });

            const formData = new FormData();
            formData.append("content", trimmedText);
            if (imageFile) formData.append("image", imageFile);
            if (videoFile) formData.append("video", videoFile);
            if (pdfFile) formData.append("document", pdfFile);

            const token = localStorage.getItem("token");

            fetch("http://localhost:3001/collablearn/user/uploadPost", {
              method: "POST",
              headers: {
                Authorization: `${token}`, // or however you store the token
              },
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  toast.success("Post uploaded successfully");

                  setText("");
                  setImageFile(null);
                  setVideoFile(null);
                  setPdfFile(null);
                  setPrivacy("public");
                  setHighlightedText(""); // Reset highlighted text
                  closeModal();
                } else {
                  toast.error("Failed to upload post: " + data.message);
                }
              })
              .catch((error) => {
                console.error("Error uploading post:", error);
                toast.error("Error uploading post");
              });
          } else {
            const highlighted = highlightToxicWords(trimmedText, toxicWords);
            setHighlightedText(highlighted);
            toast.error("Toxic content detected in your post. Please revise.");
          }
        } else {
          toast.error(
            "There is an issue with the Toxic Word Detection Module. Please try again."
          );
        }
      }, 2000); // Wait for 2 seconds
    } catch (error) {
      console.error("Error querying API:", error);
      toast.error("Error querying toxic word detection API.");
    } finally {
      setLoading(false); // End loading
    }
  };

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

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/IMSyPP/hate_speech_en",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  const highlightToxicWords = (text, toxicWords) => {
    let highlighted = text;
    toxicWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlighted = highlighted.replace(
        regex,
        "<span class='bg-red-200'>$1</span>"
      );
    });
    return highlighted;
  };

  return (
    <>
      <ToastContainer />
      <button
        className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        onClick={openModal}
      >
        Post
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <div className="flex items-center">
                <img
                  src={`http://localhost:3001/${
                    JSON.parse(localStorage.getItem("userInfo"))?.profilePicture
                  }`}
                  alt="User"
                  className="w-10 h-10 rounded-full border border-indigo-400"
                />
                <p className="ml-4 text-lg">Something to write or share?</p>
              </div>
              <img
                onClick={closeModal}
                src={cross}
                alt="Close"
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <textarea
                  placeholder="Write something"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                />
                {textError && <p className="text-red-500">{textError}</p>}{" "}
                {/* Error message */}
                <div
                  className="mt-2 text-red-500"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
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
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="py-2 px-4 bg-gray-200 rounded-lg"
                >
                  <option value="General">General</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Industrial">Industrial-Professional</option>
                </select>
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  disabled={loading || !text.trim()} // Disable if loading or text is empty
                >
                  {loading ? "Creating Post..." : "Create Post"}{" "}
                  {/* Show loading text */}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatePostModal;
