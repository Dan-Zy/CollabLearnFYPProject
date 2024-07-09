import React, { useState } from 'react';
import PostCard from './createPostCard';

function Feed({ communityId }) {
  const [createPost, setCreatePost] = useState(false);
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setCreatePost(!createPost)}
        className="text-indigo-600 border border-indigo-600 rounded px-4 py-2 mt-2"
      >
        {createPost ? "Cancel" : "Create Post"}
      </button>
      {createPost && <PostCard communityId={communityId} onClose={() => setCreatePost(false)} />}
    </div>
  );
}

export default Feed;
