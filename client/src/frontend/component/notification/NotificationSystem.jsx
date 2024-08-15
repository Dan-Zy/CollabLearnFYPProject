import React, { useState, useEffect } from "react";
import { Bell } from 'lucide-react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export function NotificationSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [userInfo, setUserInfo] = useState(null);
  const [ReqNotifications, setReqNotifications] = useState([]);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);

        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
       
        setUserInfo(userInfoResponse.data.user);
        console.log('====================================');
        console.log(userInfo.receivedRequests);
        console.log('====================================');
        setReqNotifications(userInfoResponse.data.user.receivedRequests); // Ensure that receivedRequests is an array
         
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndNotifications();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev); 
  };

  const handleAccept = (id) => {
    console.log(`Accepted request with id: ${id}`);
    setReqNotifications(ReqNotifications.filter(notification => notification.id !== id));
  };

  const handleCancel = (id) => {
    console.log(`Canceled request with id: ${id}`);
    setReqNotifications(ReqNotifications.filter(notification => notification.id !== id));
  };

  return (
    <>
      <button onClick={toggleModal} className="ml-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none">
        <Bell className="text-gray-600" />
      </button>

      {isModalOpen && (
        <div className="fixed top-0 right-0 m-4 bg-gray-800 bg-opacity-50 flex items-start justify-end z-10" onClick={toggleModal}>
          <div className="bg-white p-4 border border-indigo-300 rounded-lg shadow-lg w-full max-w-md mx-auto md:max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <button 
                  className={`flex-1 py-2 ${activeTab === 'requests' ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500' : ''} text-sm md:text-base rounded-lg`}
                  onClick={() => setActiveTab('requests')}
                >
                  Requests
                </button>
                <button 
                  className={`flex-1 py-2 ${activeTab === 'others' ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500' : ''} text-sm md:text-base rounded-lg`}
                  onClick={() => setActiveTab('others')}
                >
                  Others
                </button>
              </div>
              <div className="mt-4 overflow-auto max-h-60">
                {activeTab === 'requests' && ReqNotifications.length > 0 ? (
                  ReqNotifications.map(notification => (
                    <div key={notification.id} className="flex items-center mb-3">
                      <div className="text-sm md:text-base flex-1">
                        <p className="font-bold">{notification} has sent you a collab request</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAccept(notification.id)} 
                          className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs md:text-sm"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleCancel(notification.id)} 
                          className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs md:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center">No notifications available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationSystem;
