import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div className="flex justify-center border-b-2 p-1 border-indigo-100 items-center cursor-pointer "  onClick={handleFunction} >
        <img
          src={user.user.profilePicture ? `http://localhost:3001/${user.user.profilePicture}` : 'https://via.placeholder.com/40'}
          alt="Profile"
          className="flex rounded-full w-12 h-12 mr-3  border border-indigo-500 p-2"
        />

        <div>
          <h4 className=" flex font-semibold">{user.user.username || "User"}</h4>
          <p className="flex text-sm text-gray-500">{user.user.role || "Role"}</p>
        </div>
      </div>

  );
};

export default UserListItem;
