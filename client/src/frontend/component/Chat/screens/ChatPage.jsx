import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import ChatBox from "../ChatBox";
import MyChats from "../MyChats";
import { Box } from "@chakra-ui/layout";
import SideDrawer from "../miscellaneous/SideDrawer";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const { user, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/collablearn/fetch-chats");
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
