import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/home');
      }, 1000); // Duration of the fade-out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`flex flex-1 justify-center items-center text-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="flex font-bold text-4xl">Welcome To Collablearn</h1>
    </div>
  );
}
