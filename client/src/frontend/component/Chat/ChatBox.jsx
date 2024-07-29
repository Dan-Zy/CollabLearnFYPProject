import React from "react";
import { ChatState } from "./Context/ChatProvider";
import { Box, Button } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat } = ChatState();

  return (
    <Box
      display={selectedChat ? "flex" : "none"}
      alignContent="center"
      flexDir="column"
      p={3}
      bg="white"
      w="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      {selectedChat && (
        <Button onClick={() => setSelectedChat(null)} mb={3}>
          Back
        </Button>
      )}
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
