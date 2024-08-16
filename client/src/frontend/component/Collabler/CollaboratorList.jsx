import React, { useState, useEffect } from "react";
import CollaboratorItem from "./CollaboratorItem";
import jwtDecode from "jwt-decode";
import axios from "axios";
function CollaboratorList() {
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = jwtDecode(token);

      try {
        console.log("1");
        // const userInfoResponse = await axios.get(
        //   `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
        //   {
        //     headers: {
        //       Authorization: `${token}`,
        //     },
        //   }
        // );

        const userCollablers = await axios.get(
          `http://localhost:3001/collablearn/getAllCollablers`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        // const userInfo = userInfoResponse.data;

        // console.log("User Info: ", userInfo.user._id);

        console.log("Collabler: ", userCollablers.data.collablers);

        setCollaborators(userCollablers.data.collablers);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUser();
  }, []);

  const handleCollaboratorClick = (collaborator) => {
    setSelectedCollaborator(collaborator);
  };

  if (selectedCollaborator) {
    alert("Page not developed");
    // return <ProComp {...selectedCollaborator} />;
  }

  return (
    <div className="m-4">
      <div className="flex w-1/2 justify-between items-center mb-4">
        <h2 className="text-indigo-600">My Collaborator</h2>
        <a href="/see-all" className="text-black">
          See all
        </a>
      </div>
      {collaborators.map((collab, index) => (
        <CollaboratorItem
          key={index}
          {...collab}
          onClick={() => handleCollaboratorClick(collab)}
        />
      ))}
    </div>
  );
}

export default CollaboratorList;
