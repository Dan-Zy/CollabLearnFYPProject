import React, { useState, useEffect } from "react";
import axios from 'axios';

export function CreateCommunity() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [communityImage, setCommunityImage] = useState(null);
  const [privacy, setPrivacy] = useState('public');
  const [genre, setGenre] = useState('');

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
    const formData = new FormData();
    formData.append('communityName', communityName);
    formData.append('description', description);
    formData.append('communityImage', communityImage);
    formData.append('privacy', privacy);
    formData.append('genre', genre);

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      toggleModal(); // Close the modal on successful submission
    } catch (error) {
      console.error("There was an error creating the community!", error);
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
                <input
                  type="text"
                  value={communityName}
                  onChange={e => setCommunityName(e.target.value)}
                  placeholder="Community Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="file"
                  onChange={e => setCommunityImage(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={privacy}
                  onChange={e => setPrivacy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <p className="text-sm text-gray-600">
                  Status: {privacy === 'public' ? 'Everyone can post who’s join it' : 'Admin give the special rights'}
                </p>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {['Artificial Intelligence', 'Machine Learning', 'Software Developing', 'Data Science', 'Networking', 'Other'].map(g => (
                      <label key={g} className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-full ${genre === g ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                        <input
                          type="radio"
                          name="genre"
                          value={g}
                          checked={genre === g}
                          onChange={() => handleGenreChange(g)}
                          className="hidden"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateCommunity;
