/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import ImageComponent from '../../ImageComponent';
import { Button, Box, Text, Input } from '@chakra-ui/react';
const socket = io('http://localhost:5000'); // Replace with your server URL
import "./chats.css";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const ShowChatsSection = ({ imgURL, username, hideChats, currentUser, isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [textMsg, setTextMsg] = useState('');
  const [room, setRoom] = useState('');
  const [msgId, setMsgId] = useState(0);
 

  // Hook to fetch Chats
  const fetchChats = async () => {
    try {
      const response = await api.get('/api/socialSquare/fetchChats', { params: { currentUser, username } });
      setMessages(response.data); // Update the messages state with the fetched data
    } catch (error) {
      console.log(`Error fetching chats: ${error}`);
    }
  };

  // hook to set the room id 
  useEffect(() => {
    const fetchData = async () => {
      await fetchChats(); // Call the fetchChats function
      const roomId = "socialSquareChat123";
      socket.emit("joinRoom", roomId);
      setRoom(roomId);
    };
    fetchData(); // Invoke the fetchData function when the component mounts
  }, []); 

  // hook to get the message from the back end
  useEffect(() => {
    socket.on("recieveMessage", (data) => {
      try{
        setMessages((prevMsg) => [...prevMsg, data]);
      }
      catch(er){
        console.log(er);
      }
    });
  }, [socket]);

  // function to close the chat and handle room left event of socket
  function handleChatClose(){
    socket.emit("roomleft");
    hideChats();
  }

  const sendMessage = (currentUser, reciever, msg) => {
    setTextMsg('');
    try {
      if(msg.trim() === ""){
        return null;
      }

      const data = {
        _id: currentUser + msgId,
        sender: currentUser,
        room: room,
        toWho: reciever,
        message: msg,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      }

      socket.emit("sendMessage", data);
      setMsgId(prevMsgId => prevMsgId + 1);
      try{
        setMessages((prevMsg) => [...prevMsg, data]);
      }
      catch(er){
        console.log(er);
      }
      
      // Handle the response if needed
    } catch (error) {
      // Handle errors if the request fails
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <Box className="card chats-card" >
      <Box 
      bg={!isDarkMode ? "light.secondary": "dark.secondary"}
      transition={"ease-in 0.5s"}
      className="card-header d-flex align-items-start justify-content-between" >
        <Box className="d-flex align-items-center">
          <Box className="col-auto">
            <ImageComponent imgSrc={imgURL} width={50} isDp={true}/>
          </Box>
          <Box className="col d-flex flex-column mt-3">
            <Box className="d-flex flex-grow-1">
              <a href="#" className="btn">
                <Text id="chats-heading" className="chats-heading" style={{ fontSize: "23px" }} 
                color={!isDarkMode ? "light.text" : "dark.text"}
                transition={"ease-in 0.5s"}
                >
                  {username}
                </Text>
              </a>
            </Box>
          </Box>
        </Box>
        <Box>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleChatClose}></button>
        </Box>
      </Box>

      <Box className="card-body convo-body mx-0 my-0">
        <Box className="chatsSize mt-auto">
          <Box 
          bg={!isDarkMode ? "light.accent": "dark.accent"}
          transition={"ease-in 0.5s"}
          className="chatsHere">
            {messages.length > 0 && <ChatMessages messages={messages} username={username} />}
          </Box>
        </Box>
      </Box>

      <Box 
      bg={!isDarkMode ? "light.secondary": "dark.secondary"}
      transition={"ease-in 0.5s"}
      className="card-footer bg-msgFooter">
        <Box 
        className="input-group">
          <Input
            bg={!isDarkMode ? "": "dark.accent"}
            transition={"ease-in 0.5s"}
            type="text"
            className="form-control"
            value={textMsg}
            placeholder="Type a message..."
            onChange={(e) => setTextMsg(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => sendMessage(currentUser, username, textMsg)}>
            Send
          </button>
        </Box>
      </Box>
    </Box>
  );
};

function ChatMessages({ messages, username }) {
  if (messages) {
    // Remove duplicate messages with the same ID
    const uniqueMessages = messages.reduce((uniqueMsgs, msg) => {
      // Check if the message with the same ID already exists in uniqueMsgs
      const existingMsg = uniqueMsgs.find((uniqueMsg) => uniqueMsg._id === msg._id);
      if (!existingMsg) {
        // If the message doesn't exist, add it to uniqueMsgs
        uniqueMsgs.push(msg);
      }
      return uniqueMsgs;
    }, []);

    return (
      <Box className="chat-element">
        {uniqueMessages.map((msg, index) => (
          <Box className={`chat-bubble-${msg.sender === username ? 'left' : 'right'}`} key={index}>
            <h6>{msg.message}</h6>
          </Box>
        ))}
      </Box>
    );
  }
}

export default ShowChatsSection;
