import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import jwt_decode from "jwt-decode";
import {
  Button,
  Tooltip,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";
import UserListItem from "../UserAvatar/UserListItem";
import { useLocation } from "react-router-dom";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const location = useLocation();
  const id = location.state?.id;

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 500,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const decodedToken = jwt_decode(token);
      console.log("Fetching user info for id:", id);

      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/collablearn/user/getUser/${search}`,
        config
      );
      setLoading(false);
      setSearchResult(Array.isArray(data) ? data : [data]);
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      console.log('====================================');
      console.log(userId);
      console.log('====================================');
      setLoadingChat(true);
      const token  = localStorage.getItem('token');
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:3001/collablearn/access-chat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px"
      borderWidth="5px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-end">
          <Box display="flex" alignItems="center">
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="ghost" onClick={handleSearch}>
              <SearchIcon />
            </Button>
          </Box>
        </Tooltip>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Box mt={2} w="100%">
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user.user._id)}
            />
          ))
        )}
        {loadingChat && <Spinner ml="auto" display="flex" />}
      </Box>
    </Box>
  );
};

export default SideDrawer;
