import img from '../../../../assets/post1.jpg'
import React from 'react';

function CoverPhoto() {
  return (
    <div className="cover-photo w-[62vw] h-[40vh] flex justify-center items-center mt-1">
  <img className="cover-photo-img rounded w-full h-full" src={img} alt="" />
</div>

  );
}

export default CoverPhoto;
