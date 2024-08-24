import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./NavBar";
import { SearchBar } from "./SearchBar";
import { GenreSelector } from "./GenerSelector";
import { CommunityCard } from "./CommunityCard";
import CommunityViewHome from "./CommunityView/CommunityViewHome";
import jwt_decode from "jwt-decode";
import Notification from "../SystemNotification";

export function CommunityHome() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "joined"
  );
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchQuery") || ""
  );
  const [selectedGenre, setSelectedGenre] = useState(
    localStorage.getItem("selectedGenre") || ""
  );
  const [communities, setCommunities] = useState([]);
  const [userId, setUserId] = useState("");
  const [view, setView] = useState("CommunityHome");
  const [communityId, setCommunityId] = useState(null);
  const [flash, setFlash] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.id);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/collablearn/getCommunities",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Fetched Communities:", response.data.communities); // Debugging log
        setCommunities(response.data.communities);
        setNotification({
          message: "Communities loaded successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error fetching communities", error);
        setNotification({
          message: "Error fetching communities",
          type: "error",
        });
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("selectedGenre", selectedGenre);
  }, [selectedGenre]);

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };

  const handleRemoveCommunity = (communityId) => {
    setCommunities((prevCommunities) =>
      prevCommunities.filter((community) => community._id !== communityId)
    );
    setActiveTab("joined");
  };

  const handleChangeView = (newView, communityId) => {
    setView(newView);
    setCommunityId(communityId);
  };

  const handleBack = () => {
    setView("CommunityHome");
  };

  const triggerFlashEffect = (callback) => {
    setFlash(true);
    setTimeout(() => {
      callback();
      setFlash(false);
    }, 500);
  };

  const handleGenreChange = (genre) => {
    triggerFlashEffect(() => setSelectedGenre(genre));
  };

  const handleTabChange = (tab) => {
    triggerFlashEffect(() => setActiveTab(tab));
    setSelectedGenre("");
  };

  const handleLeaveCommunity = async (communityId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3001/collablearn/leaveCommunity/${communityId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      handleRemoveCommunity(communityId);
      setView("CommunityHome");
      setNotification({
        message: "You have successfully left the community.",
        type: "success",
      });
    } catch (error) {
      console.error("Error leaving community", error);
      setNotification({
        message: "Failed to leave the community.",
        type: "error",
      });
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3001/collablearn/deleteCommunity/${communityId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      handleRemoveCommunity(communityId);
      setView("CommunityHome");
      setNotification({
        message: "Community has been deleted.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting community", error);
      setNotification({
        message: "Failed to delete the community.",
        type: "error",
      });
    }
  };

  const filteredCommunities = communities.filter((community) => {
    // Log the entire adminId object to inspect it
    console.log("Raw Community Admin ID:", community.adminId);

    // Determine if adminId needs to be converted or if it's nested within an object
    const adminIdString = community.adminId._id
      ? community.adminId._id.toString() // If it's nested within another object
      : community.adminId.toString(); // If it's a direct ObjectId or string

    console.log(
      "Community Admin ID (string):",
      adminIdString,
      "User ID:",
      userId.toString()
    );

    const isAdmin = adminIdString === userId.toString();
    console.log("isAdmin:", isAdmin);

    return (
      community.communityName &&
      community.communityName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      (selectedGenre === "" || community.communityGenre === selectedGenre) &&
      ((activeTab === "joined" && community.members.includes(userId)) ||
        (activeTab === "suggested" && !community.members.includes(userId)) ||
        (activeTab === "my-communities" && isAdmin)) // Only show communities where user is admin
    );
  });

  console.log("Filtered Communities:", filteredCommunities); // Debugging log

  return (
    <div className={`container mx-auto p-4 ${flash ? "animate-flash" : ""}`}>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      {view === "CommunityHome" ? (
        <>
          <div className="flex flex-col items-center">
            <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <GenreSelector
            selectedGenre={selectedGenre}
            setSelectedGenre={handleGenreChange}
          />
          <div className="mt-4">
            {filteredCommunities.length === 0 ? (
              <div className="text-center text-gray-500">
                No communities found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community._id}
                    id={community._id}
                    img={community.communityBanner}
                    title={community.communityName}
                    description={community.communityDescription}
                    memberCount={community.members.length}
                    rating={community.rating || "N/A"}
                    activeTab={activeTab}
                    onRemoveCommunity={handleRemoveCommunity}
                    onChangeView={handleChangeView}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <CommunityViewHome
          communityId={communityId}
          onLeaveCommunity={handleLeaveCommunity}
          onDeleteCommunity={handleDeleteCommunity}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default CommunityHome;
