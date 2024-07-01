import img from '../../../../assets/post1.jpg'
import React from 'react';

function CoverPhoto() {
  return (
    <div className="cover-photo h-1/3 flex justify-center items-center mt-1">
  <img className="cover-photo-img rounded w-4/5 h-full" src={img} alt="" />
</div>

  );
}

export default CoverPhoto;
