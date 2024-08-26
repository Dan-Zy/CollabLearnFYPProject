import React, { useState, useEffect } from 'react';
import PostCard from './createPostCard';
import { PostCall } from './Post/PostCall';

function Feed({ communityId }) {
  const [createPost, setCreatePost] = useState(false);
  const [error, setError] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(false); // State to trigger refresh

  useEffect(() => {
    if (!communityId) {
      setError('Community ID is required to fetch posts.');
    }
  }, [communityId]);

  const handlePostCreated = () => {
    setCreatePost(false); // Close the post creation form
    setRefreshPosts(!refreshPosts); // Toggle the refreshPosts state to trigger a refresh
  };

  return (
    <div className="flex w-full flex-col items-center">
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={() => setCreatePost(!createPost)}
        className="w-full text-indigo-600 border bg-indigo-200 rounded px-4 py-2 mt-2"
      >
        {createPost ? "Cancel" : "Create Post"}
      </button>
      {createPost && (
        <PostCard
          communityId={communityId}
          onClose={() => setCreatePost(false)}
          onPostCreated={handlePostCreated} // Pass the callback
        />
      )}
      <PostCall communityId={communityId} refreshPosts={refreshPosts} /> {/* Pass refreshPosts */}
    </div>
  );
}

export default Feed;
