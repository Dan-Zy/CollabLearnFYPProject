import React, { useState, useEffect } from "react";
import { Bell, Check, X } from 'lucide-react'; // Import tick and cross icons
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export function NotificationSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [notifications, setNotifications] = useState({ requests: [], others: [] });
  const [hasUnseen, setHasUnseen] = useState(false);

  const defaultProfilePicture = "path/to/default_user_image.png"; // Replace with the path to your default image
  const defaultUsername = "Unknown User"; // Default value for username

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);

        const response = await axios.get(
          `http://localhost:3001/collablearn/getAllNotifications`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        
        const allNotifications = response.data.data;
        // Filter notifications into requests and others
        allNotifications.sort((a,b) => new Date(b.createdAt)- new Date(a.createdAt))
        const reqNotifications = allNotifications.filter(
          (notification) => notification.type === 'Requested'
        );
        const otherNotifications = allNotifications.filter(
          (notification) => notification.type !== 'Requested'
        );

        // Check if there are any unseen notifications
        const unseenRequests = reqNotifications.some(notification => !notification.seen);
        const unseenOthers = otherNotifications.some(notification => !notification.seen);

        // Update the state only if there are changes in unseen notifications or notifications count
        const hasNewRequests = reqNotifications.length !== notifications.requests.length || unseenRequests !== hasUnseen;
        const hasNewOthers = otherNotifications.length !== notifications.others.length || unseenOthers !== hasUnseen;

        if (hasNewRequests || hasNewOthers) {
          // Determine which tab to open by default based on unseen notifications
          if (unseenRequests) {
            setActiveTab('requests');
          } else if (unseenOthers) {
            setActiveTab('others');
          }

          // Set notifications state
          setNotifications({ requests: reqNotifications, others: otherNotifications });

          // Set whether there are any unseen notifications overall
          setHasUnseen(unseenRequests || unseenOthers);
        }
         
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNotifications(); // Initial fetch

    const intervalId = setInterval(fetchNotifications, 3000); // Fetch every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [notifications, hasUnseen]);

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
    setNotifications(prev => ({
      ...prev,
      requests: prev.requests.filter(notification => notification.id !== id)
    }));
  };

  const handleCancel = (id) => {
    console.log(`Canceled request with id: ${id}`);
    setNotifications(prev => ({
      ...prev,
      requests: prev.requests.filter(notification => notification.id !== id)
    }));
  };

  return (
    <>
      <button onClick={toggleModal} className="ml-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none relative">
        <Bell className={`text-gray-600 ${hasUnseen ? 'text-indigo-500' : ''}`} />
        {hasUnseen && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-indigo-500" />
        )}
      </button>

      {isModalOpen && (
        <div className="fixed top-12 right-4 bg-gray-800 bg-opacity-50 flex items-start justify-end z-10">
          <div className="bg-white p-4 border border-indigo-300 rounded-lg shadow-lg w-72 h-96" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col h-full">
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
              <div className="mt-4 overflow-auto justify-start items-start text-left">
                {activeTab === 'requests' && notifications.requests.length > 0 ? (
                  notifications.requests.map(notification => (
                    <div key={notification.id} className="flex justify-start items-start text-left m-3 shadow-xl rounded-lg">
                      <img 
                        src={`http://localhost:3001/${notification.userId?.profilePicture || defaultProfilePicture}`} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full mr-3" 
                      />
                      <div className="text-sm md:text-base flex-1">
                        <p className="font-bold">{notification.userId?.username || defaultUsername} has sent you a collab request</p>
                        <div className="flex m-2 justify-center items-center space-x-2">
                        
                      </div>
                      
                      </div>
                      
                    </div>
                  ))
                ) : activeTab === 'requests' ? (
                  <p className="text-gray-600 text-center">No requests available</p>
                ) : notifications.others.length > 0 ? (
                  notifications.others.map(notification => (
                    <div key={notification.id} className="flex  justify-start items-start text-left shadow-lg mb-3">
                      <div className="text-sm md:text-base flex">
                      <img 
                        src={`http://localhost:3001/${notification.userId?.profilePicture || defaultProfilePicture}`} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full mr-3" 
                      />
                        <p className="font-bold">{notification.message || "No message provided"}</p>
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
