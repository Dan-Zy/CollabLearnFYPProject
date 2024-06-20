import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [image, setImage] = useState('https://via.placeholder.com/40');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
      
      const decodedToken = jwt_decode(token);
      try {
        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const userInfo = userInfoResponse.data;
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo.user));
        setUserInfo(userInfo.user);
        if (userInfo.user.profilePicture) {
          setImage(userInfo.user.profilePicture);
          console.log(userInfo.user.profilePicture);
        }

        setLoading(false);
        setTimeout(() => {
          navigate('/welcome', { state: { name: userInfo.user.name, img: userInfo.user.profilePicture } });
        }, 500);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div> // You can replace this with any loading animation component
      ) : null}
    </div>
  );
}

export default UserInfo;
