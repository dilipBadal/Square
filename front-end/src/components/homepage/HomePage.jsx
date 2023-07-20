/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../navbar/Navbar"
import { Button, Menu, MenuButton, MenuList, MenuItem, Box, Text } from '@chakra-ui/react';
import ChatHead from "./chatHeads/ChatHeads";
import Post from "./post/Post";
import NewsSuggestions from "./NewsSuggestion/NewsSuggestions";
import PostForm from "./PostForm";
import PopUp from "../popUp";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import ShowChatsSection from "./chatHeads/ChatSection";

const HomePage = ({isDarkMode, setIsDarkMode}) => {

  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [showChats, setShowChats] = useState(false);
  const [chatImg, setChatImg] = useState(null);
  const [chatUSN, setChatUSN] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [showPopUp, setShowPopUp] = useState(true);
  const [popMsg, setPopMsg] = useState('');
  const location = useLocation(); // Replace with the appropriate hook

  // Retrieve the token from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setCurrentUser(localStorage.getItem('currentUser'));
    if (storedToken !== null) {
      setToken(storedToken);
      setIsAuth(true);
    }
    else {
      setIsAuth(false);
      setShowPopUp(true)
    }
  }, []);

  const closePopup = () => {
    if(!isAuth){
      navigate('/login');
      setShowPopUp(false);
    }
  };

  function handlePopMsg(msg){
    setPopMsg(msg)
  }

  function handleShowPopUp(){
    setShowPopUp(!showPopUp);
  }


  function handleChatsToggle(chatUSN, userImgSrc) {
    setChatImg(userImgSrc);
    setChatUSN(chatUSN);
    setShowChats(true);
  }

  function hideChats() {
    setShowChats(false);
  }

  if (isAuth) {
    return (
      <Box bg={!isDarkMode ? "#fff": "dark.background"} transition={"ease-in 0.5s"}>
        <Navbar token={token} currentUser={currentUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
        <Box className="container mt-2">
          <Box className="row">
            <Box className="col-3 mt-4 d-none d-xl-block theme-tranisition">
              <Box 
              bg={!isDarkMode ? "#fff": "dark.primary"}
              transition={"ease-in 0.5s"}
              className="card shadow">
                <Box className="card-header" color={!isDarkMode ? "light.text" : "dark.text"} transition={"ease-in 0.5s"}>Chats</Box>
                <Box 
                bg={!isDarkMode ? "#fff": "dark.secondary"}
                transition={"ease-in 0.5s"}
                className="card-body" >
                  <ChatHead handleChatsToggle={handleChatsToggle} currentUser={currentUser} isDarkMode={isDarkMode}/>
                </Box>
              </Box>
            </Box>

            <Box className="col-12 col-xl-6 ">
              <PostForm token={token} isDarkMode={isDarkMode}/>
              <Post currentUser={currentUser} token={token} handleChatsToggle={handleChatsToggle} isDarkMode={isDarkMode}/>
            </Box>

            <Box
            border={"0"} borderRadius={10}
            className="col-3 mt-4 d-none d-xl-block text-center theme-transition">
              <Box className="card shadow" border={!isDarkMode ? "" : "0"} shadow={"dark-lg"} borderRadius={!isDarkMode ? "10" : "30"}>
                <Box 
                bg={!isDarkMode ? "": "dark.primary"}
                borderRadius={10}
                transition={"ease-in 0.5s"}
                border={"0"}
                className="card-body">
                  {showChats ? <ShowChatsSection imgURL={chatImg} username={chatUSN}
                   isDarkMode={isDarkMode} hideChats={hideChats} currentUser={currentUser} /> : 
                   <NewsSuggestions isDarkMode={isDarkMode} currentUser={currentUser} token={token} />}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
  else{
    return(
      <PopUp closePopup={closePopup} message={"Session Expired, Please login again"} buttonName={"Login"}/>
    )
  }
};




export default HomePage;
