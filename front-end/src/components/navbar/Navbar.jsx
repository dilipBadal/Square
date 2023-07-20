/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef  } from 'react';
import { FaUserFriends, FaBell, FaCog } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Button, Menu, MenuButton, MenuList, MenuItem, Box, Text } from '@chakra-ui/react';
import DarkModeToggle from "react-dark-mode-toggle";
import { FaCheck } from 'react-icons/fa';
import 'bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';
import "bootstrap/dist/js/bootstrap";
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import ImageComponent from '../ImageComponent';
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

function Navbar({token, isDarkMode, setIsDarkMode}) {
  const [isAuth, setIsAuth] = useState(token);
  const [requests, setRequests] = useState([]);
  const [dp, setDp] = useState();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState();
  const [hasResponsed, setHasResponed] = useState();

  const handleDropdownItemClick = (event) => {
    event.stopPropagation();
  };

  const currentUser = localStorage.getItem('currentUser');

  function handleAuth(){
    setIsAuth(false);
    navigate('/login')
  }

  function handleHomeClick(){
    navigate('/homepage');
  }

  function handleSettingsClick(){
    navigate('/resetPassword', {state: {token: token}});
  }

  function handleProfileClick(){
    navigate('/profile', {state: {username: currentUser, isLoggedIn: true, currentUser: currentUser, token: token}})
  }

  function handleFindFriendsClick(){
    navigate('/findFriends', {state: {token: token}});
  }

  const fetchUserData = async () => {
    try{
      const response = await api.get('/api/socialSquare/getUserData', {params: {username: currentUser}});
      setDp(response.data.dp);
    }catch(er){
      alert(er.response.data);
    }
  }
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.post('/api/socialSquare/handleSentRequest', { viewer: currentUser });
        if (response.status === 200) {
          const received = response.data.requestReceived;
          await Promise.all(
            received.map(async (rec) => {
              try {
                const response = await api.get("/api/socialSquare/getUserData", { params: { username: rec } });
                const data = {
                  username: response.data.username,
                  dp: response.data.dp,
                  bio: response.data.bio,
                };
                const isDataExists = requests.some((request) => request.username === data.username);
                if (!isDataExists) {
                  setRequests([...requests, data]);
                }
                // Do something with the data
              } catch (error) {
                console.log(`Error retrieving data for username ${rec}:`, error.response.data);
              }
            })
          );
        }
      } catch (error) {
        console.log("Error fetching requests:", error.response);
      }
    };

    if(token){
      fetchUserData();
      fetchRequests();
    }
  }, [isAuth]);

  const handleRequest = async(accepted, username, currentUser) => {
    const response = await api.post('/api/socialSquare/handleFollowRequest', {isAccepted: accepted, sender: username, currentUser: currentUser});
    if(response.status == 200){
      setAccepted(accepted);
      setHasResponed(true);
    }
  }
  
  return (
    <Box 
    className="navbar navbar-expand-lg navbar-primary px-2 mx-0"
    bg={!isDarkMode ? "light.primary": "dark.primary"}
    transition={"ease-in 0.5s"}
    >
      <a className="navbar-brand">
        <span className="navbar-brand-name d-flex align-center justify-center mx-3 text-white"
         onClick={handleHomeClick}>Social Square</span>
      </a>

      {isAuth && token ? (
        <div className="d-flex justify-content-center align-items-center" onClick={handleProfileClick} style={{cursor: "pointer"}}>
          <ImageComponent imgSrc={dp} isDp={true} width={50}/>
          <Text className='mx-3  mt-3'
          justifyContent={"center"}
          alignItems={"center"} 
          style={{fontWeight: "bold", fontSize: "20px"}}
          color="dark.text"
          >{currentUser}</Text>
      </div>
      ): ""}
      <div className='d-flex ms-auto'>

        {/* Dark mode switch toggle */}
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mx={4}>
          <DarkModeToggle onChange={setIsDarkMode} checked={isDarkMode} size={50} />
        </Box>

        {/* Show Find Friends button */}
        {isAuth && (
          <button className="btn btn-link text-white mx-5" onClick={handleFindFriendsClick}>
            <FaUserFriends className="navbar-icon" size={25}/>
          </button>
        )}
        {/* Show Notification Dropdown */}
        {isAuth && (
          <NotificationDropdown requests={requests} 
          handleRequest={handleRequest} hasResponsed={hasResponsed} 
          accepted={accepted} currentUser={currentUser} handleDropdownItemClick={handleDropdownItemClick} />
        )}
        {/* Show Settings Dropdown */}
        {isAuth && (
          <div className='ms-auto mx-5'>
            <MoreMenu handleAuth={handleAuth} handleSettingsClick={handleSettingsClick}/>
          </div>
        )}
      </div>
    </Box>
  );
}

const MoreMenu = ({handleAuth, handleSettingsClick}) => {

  const handleLogOut = () => {
    localStorage.clear();
    handleAuth()
  };



  return (
    <Box className='d-flex justify-content-end align-items-center ms-5'>
  <Menu autoClose={false}>
    <MenuButton 
      as={Button}
      px={4}
      py={2}
      transition='all 0.2s'
      bg={"transparent"}
      _hover={{bg: "transparent"}}
      _focus={{ outline: 'none', bg: "transparent" }}
    >
      <FaCog size={25} color="whitesmoke" />
    </MenuButton>
    <MenuList
      placement="left-start" // Open the dropdown on the left side
      minWidth="180px"
      boxShadow="lg"
      borderRadius="md"
      py={1}
    >
      <MenuItem 
      onClick={() => handleSettingsClick('Settings')} 
      _hover={{ cursor: "pointer", bg: 'gray.400'}}
      py="2"
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      >Settings
      </MenuItem>
      {/* <MenuItem 
      py="2"
      
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      >
      </MenuItem> */}
      <MenuItem 
      onClick={() => handleLogOut('Log Out')} 
      py="2"
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      _hover={{ cursor: "pointer", bg: 'gray.400'}}
      >Log Out</MenuItem>
    </MenuList>
  </Menu>
</Box>

    // <div className="dropdown ms-5">
    //   <button
    //     className="btn dropdown-toggle no-arrow"
    //     type="button"
    //     id="dropdownMenuButton"
    //     data-bs-toggle="dropdown"
    //     aria-expanded="false"
    //   >
    //     <FaCog className="dropdown-icon" size={25} color='whitesmoke'/>
    //   </button>
    //   <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" ref={dropdownRef}>
    //     <li>
    //       <button className="dropdown-item" onClick={() => handleItemClick('Settings')}>
    //         Settings
    //       </button>
    //     </li>
    //     <li className='d-flex align-items-center px-3 my-2'>
    //     <DarkModeToggle
    //           onChange={setIsDarkMode}
    //           checked={isDarkMode}
    //           size={50}
    //         />
    //     </li>
    //     <li>
    //       <button className="dropdown-item border-top" onClick={() => handleLogOut('Log Out')}>
    //         Log Out
    //       </button>
    //     </li>
    //   </ul>
    // </div>
  );
};


function NotificationDropdown({requests, handleRequest, hasResponsed, accepted, currentUser, dropdownRef, handleDropdownItemClick}) {
  if(requests){
    return (
      <div className="dropdown">
        <button
          className="btn btn-link text-white dropdown-toggle no-arrow"
          type="button"
          id="notificationDropdown"
          data-bs-toggle="dropdown"
          data-bs-auto-close="false"
          aria-expanded="false"
        >
          <FaBell className="navbar-icon mx-2" size={25} />
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown" ref={dropdownRef}>
          {requests.length > 0 ? requests.map((rec, index) => (

            <li key={index} className='d-flex dropdown-item-width' onClick={handleDropdownItemClick}>
              <div className='d-flex flex-column justify-content-center align-items-center w-100'>
                <div className='d-flex justify-content-center align-items-center w-100'>
                  <ImageComponent imgSrc={rec.dp} dp={true} width={25}/>
                  <p className="dropdown-item w-50 bold text-lg">
                    {rec.username}
                  </p>
                </div>

                <div>
                  {(hasResponsed ? 
                  <button className={accepted ? 'btn btn-primary mx-1' : 'btn btn-secondary mx-1'} onClick={() => handleRequest(true)}>
                    <FaCheck className="me-1" />
                    {accepted ? "Accepted" : "Rejected"}</button> :
                  <>
                  <button className='btn btn-primary mx-1' onClick={() => handleRequest(true, rec.username, currentUser)}>Accept</button>
                  <button className='btn btn-secondary mx-1' onClick={() => handleRequest(false)}>Decline</button>
                  </>
                  )}
                </div>
                </div>
            </li>

          )) : <li className='dropdown-item-width text-center'>
              No new notification
            </li>}
        </ul>
      </div>
    );
  }
}

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
