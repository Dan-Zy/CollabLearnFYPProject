import React from 'react';

function CoverPhoto({ imgSrc }) {
  return (
    <div className="cover-photo w-[100%] h-[40vh] flex justify-center items-center mt-1">
      <img className="cover-photo-img rounded w-[100%] h-[40vh]" src={imgSrc ? `http://localhost:3001/${imgSrc}` : 'https://via.placeholder.com/40'} alt="Community Cover" />
    </div>
  );
}

export default CoverPhoto;
