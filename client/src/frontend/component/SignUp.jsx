import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/MainLogo_White.png';
import fb from "../../assets/facebook_icon.png";
import google from "../../assets/google_original_icon.png";
import ln from "../../assets/linkedin_icon.png";

export function SignUp() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/role', { state: { userInfo } });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <div className="flex flex-col bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-6 md:flex-1 justify-center items-center">
        <div className="mb-8">
          <img src={logo} alt="logo" className="w-40 h-auto" />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-4">Already Have an Account?</h1>
          <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
          <p className="text-lg mb-8">
            To keep connected with us log in <br />
            with your personal information
          </p><a href="/">
          <button className="w-40 py-2 border border-white rounded-full  text-indigo-500 hover:bg-white hover:text-indigo-600 transition duration-300">
            Sign In
          </button></a>
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center items-center text-center bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Create Account</h1>
        <div className="flex justify-center mb-4">
          <img src={fb} alt="fb" className="w-8 h-8 mx-2" />
          <img src={google} alt="google" className="w-8 h-8 mx-2" />
          <img src={ln} alt="ln" className="w-8 h-8 mx-2" />
        </div>
        <p className="flex justify-center items-center text-center text-gray-600 mb-4">or use your email account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={userInfo.name}
            onChange={handleChange}
            className="flex justify-center items-center text-center w-80 p-2 mb-4 border border-indigo-600 rounded-full bg-gray-200"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={userInfo.email}
            onChange={handleChange}
            className="flex justify-center items-center text-center w-80 p-2 mb-4 border border-indigo-600 rounded-full bg-gray-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={userInfo.password}
            onChange={handleChange}
            className="flex justify-center items-center text-center w-80 p-2 mb-4 border border-indigo-600 rounded-full bg-gray-200"
            required
          />
          <button
            type="submit"
            className="flex justify-center items-center text-center w-40 py-2 bg-indigo-600  text-white rounded-full hover:bg-transparent hover:text-indigo-600 border border-indigo-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
