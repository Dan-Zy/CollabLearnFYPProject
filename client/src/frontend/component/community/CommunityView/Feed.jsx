import React, { useState, useEffect } from 'react';
import PostCard from './createPostCard';
import { PostCall } from './Post/PostCall';

function Feed({ communityId }) {
  const [createPost, setCreatePost] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if communityId is provided, otherwise set an error
    if (!communityId) {
      setError('Community ID is required to fetch posts.');
    }
  }, [communityId]);

  return (
    <div className="flex w-full flex-col items-center">
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={() => setCreatePost(!createPost)}
        className="text-indigo-600 border border-indigo-600 rounded px-4 py-2 mt-2"
      >
        {createPost ? "Cancel" : "Create Post"}
      </button>
      {createPost && <PostCard communityId={communityId} onClose={() => setCreatePost(false)} />}
      <PostCall communityId={communityId} />
    </div>
  );
}

export default Feed;
