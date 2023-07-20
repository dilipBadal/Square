/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import ImageComponent from '../../ImageComponent'
import { Button, Box, Text, Input } from '@chakra-ui/react';
import "./chats.css"
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

/* eslint-disable react/prop-types */
function ChatHead({handleChatsToggle, currentUser, isDarkMode}) {
  const [chatHeads, setChatHeads] = useState([]);

  const handleClick = (username, userImg) => {
    handleChatsToggle(username, userImg);
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await api.get('/api/socialSquare/fetchChatHeads', { params: { currentUser } });
        setChatHeads(response.data);
      }
      catch(er){
        console.log(er.response.data);
      }
    }
    fetchData();
  }, []);

  return (
    <>
    {
     chatHeads.length > 0 ? <Chats handleClick={handleClick} chatHeads={chatHeads} isDarkMode={isDarkMode}/> : "No Chats yet! Start a convo"
    }
    </>
  );
}

function Chats({ handleClick, chatHeads, isDarkMode }) {
  const [isLoading, setIsLoading] = useState(true);
  if(chatHeads == null){
    return (
      <>
      <h3>Start a Convo</h3>
      </>

    );
  }
  return (
    <>
      {chatHeads &&
        chatHeads.map((chat) => (
          <Box 
          bg={!isDarkMode ? "#fff": "dark.accent"}
          transition={"ease-in 0.5s"}
          className="row chat-main my-2" key={chat.lastMessage._id}>
            <Box
              className="d-flex align-items-start border text-color"
              id="chats-section"
              onClick={() => handleClick(chat.username, chat.dp)}
            >
              <Box className="col-auto me-3">
                <Box className={isLoading ? 'loading-dp' : ''}>
                  <ImageComponent imgSrc={chat.dp} width={"50px"} isDp={true} handleLoading={() => setIsLoading(false)}/>
                </Box>
              </Box>
              <Box className="col d-flex flex-column mt-2">
                <Box className="d-flex flex-grow-1">
                  <Text color={!isDarkMode ? "light.text" : "dark.text"} transition={"ease-in 0.5s"} id="user-name" className="user-name text-color mt-1" style={{ fontSize: '15px', fontWeight: "bold" }}>
                    {chat.username}
                  </Text>
                </Box>
                <Box className="d-flex flex-grow-2">
                  <Text
                    color={!isDarkMode ? "light.text" : "dark.text"} transition={"ease-in 0.5s"}
                    id="user-name-last-message"
                    className="user-name-last-message text-color mx-2"
                    style={{ fontSize: '15px' }}
                  >
                    {chat.lastMessage.message}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
    </>
  );
}


export default ChatHead;


