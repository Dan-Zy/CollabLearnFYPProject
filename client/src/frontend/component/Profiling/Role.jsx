import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/MainLogo_White.png';
import fac from '../../../assets/faculty.png';
import std from '../../../assets/student.png';
import pro from '../../../assets/professional.png';

export default function Role() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = location.state;

  const handleRoleSelection = (role) => {
    navigate(`/BasicQuestion${role}`, { state: { userInfo, role } });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex flex-1 flex-col items-center bg-indigo-600 p-2">
        <div className="">
          <img src={logo} alt="Logo" className="w-1/2 lg:w-1/4" />
        </div>
        <div className="flex flex-1 flex-col justify-center items-center text-center text-white">
          <h2 className="text-5xl font-bold">Be a Collabler</h2>
          <p className="mt-4 text-l">Choose what describes you best</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-indigo-600 ">Join us</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <div onClick={() => handleRoleSelection('Student')} className="flex flex-col ml-10 items-center hover:scale-105 transition transform duration-300 cursor-pointer">
            <img src={std} alt="Student" className="w-24 h-24 mb-2 rounded-full border border-gray-300 " />
            <p className='text-indigo-600'>Student</p>
          </div>
          <div onClick={() => handleRoleSelection('Faculty')} className="flex flex-col ml-10 items-center hover:scale-105 transition transform duration-300 cursor-pointer">
            <img src={fac} alt="Faculty" className="w-24 h-24 mb-2 rounded-full border border-gray-300" />
            <p className='text-indigo-600'>Faculty</p>
          </div>
          <div onClick={() => handleRoleSelection('Industrial')} className="flex flex-col ml-10 items-center hover:scale-105 transition transform duration-300 cursor-pointer">
            <img src={pro} alt="Professional" className="w-24 h-24 mb-2 rounded-full border border-gray-300" />
            <p className='text-indigo-600'>Professional</p>
          </div>
        </div>
      </div>
    </div>
  );
}
