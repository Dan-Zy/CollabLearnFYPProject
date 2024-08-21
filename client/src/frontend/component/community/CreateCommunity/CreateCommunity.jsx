import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export function CreateCommunity() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [communityImage, setCommunityImage] = useState(null);
  const [privacy, setPrivacy] = useState('Public');
  const [communityGenre, setGenre] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);  // Disable button by setting loading state to true
    const formData = new FormData();
    formData.append('communityName', communityName);
    formData.append('communityDescription', communityDescription);
    formData.append('image', communityImage);
    formData.append('privacy', privacy);
    formData.append('communityGenre', communityGenre);
  
    try {
      const response = await axios.post('http://localhost:3001/collablearn/createCommunity', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}` // Include the token in the Authorization header
        },
      });
  
      if (response.status === 201 || response.status === 200) {
        // Community created successfully
        toast.success("Community created successfully!");
        toggleModal();
        // Reset form fields
        setCommunityName('');
        setCommunityDescription('');
        setCommunityImage(null);
        setPrivacy('Public');
        setGenre('');
        setError('');
      } else {
        // Handle unexpected response status
        setError("Unexpected response from the server.");
        console.error("Unexpected status code:", response.status, response.data);
      }
    } catch (error) {
      if (error.response) {
        // Server returned a response with a status code other than 2xx
        setError(error.response.data.message || "An error occurred on the server.");
        console.error("Server responded with:", error.response.status, error.response.data);
      } else if (error.request) {
        // Request was made but no response was received
        setError("No response from the server. Please try again later.");
        console.error("No response received:", error.request);
      } else {
        // Something else happened in making the request
        setError("An error occurred while creating the community.");
        console.error("Error occurred:", error.message);
      }
    } finally {
      setIsLoading(false);  // Re-enable the button after processing is done
    }
  };
  
  return (
    <>
      <button onClick={toggleModal} className="bg-indigo-500 text-white px-4 py-2 rounded-full">Create Community</button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={toggleModal}>
          <div className="bg-white border border-indigo-600 rounded-lg shadow-lg w-full max-w-lg h-4/5 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="create-community-modal h-full overflow-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold">Create Community</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                  type="text"
                  value={communityName}
                  onChange={e => setCommunityName(e.target.value)}
                  placeholder="Community Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  value={communityDescription}
                  onChange={e => setCommunityDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  maxLength="500"
                  required
                />
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={e => setCommunityImage(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={privacy}
                  onChange={e => setPrivacy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
                <p className="text-sm text-gray-600">
                  Status: {privacy === 'Public' ? 'Everyone can post who’s joined it' : 'Admin gives the special rights'}
                </p>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {['Artificial Intelligence', 'Machine Learning', 'Human Computer Interaction', 'Software Development', 'Data Science', 'Networking', 'Other'].map(g => (
                      <label key={g} className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-full ${communityGenre === g ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                        <input
                          type="radio"
                          name="genre"
                          value={g}
                          checked={communityGenre === g}
                          onChange={() => handleGenreChange(g)}
                          className="hidden"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateCommunity;
