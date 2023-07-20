/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCheck } from 'react-icons/fa';
import { Button, Menu, MenuButton, MenuList, MenuItem, Box, Text, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import ImageComponent from '../ImageComponent';
import './findFriends.css'

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

const FindFriends = ({ isDarkMode, setIsDarkMode }) => {

    const location = useLocation();
    const token = location.state.token;
    const currentUser = localStorage.getItem('currentUser');

    const [searchUSN, setSearchUSN] = useState('');
    const [userData, setUserData] = useState([]);
    const [dataFound, setDataFound] = useState(false);

    const getUserData = async () => {
        if (token && currentUser) {
            try {
                const response = await api.get('/api/socialSquare/getUserData', {
                    params: {
                        username: searchUSN,
                        isSearch: true, currentUser: currentUser
                    }
                });
                if (response.status == 200) {
                    console.log(response.data.user);
                    setUserData(response.data.user);
                    setDataFound(true);
                }
            }
            catch (er) {
                alert("Error: " + er.response.data);
            }
        }
    }

    const handleUnfollow = async (username) => {
        try {
            const response = await api.post('/api/socialSquare/removeFollowing', { viewer: currentUser, postUser: username });
            if (response.status == 200) {
                getUserData();
            }
        }
        catch (er) {
            console.log(er.response.data);
        }
    }

    const handleSentRequest = async (username) => {
        try {
            const response = await api.post('/api/socialSquare/handleSentRequest', { viewer: currentUser, postUser: username });
            if (response.status == 200) {
                getUserData();
            }
        }
        catch (er) {
            console.log(er.response.data);
        }
    }

    return (
        <>
            <Navbar token={token} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <Box className="search-bar d-flex justify-content-center flex-column align-items-center"
                minHeight={"88.5vh"}
                overflowY={"auto"}
                bg={!isDarkMode ? "light.secondary" : "dark.background"}
                transition={"ease-in 0.5s"}
            >
                <div className='d-flex justify-content-center flex-column align-items-center'>
                    <Text className='mt-5 mb-0 heaidng' color={!isDarkMode ? "#fff" : "dark.text"} transition={"ease-in 0.5s"}>Find Friends</Text>
                    <Text className='sub-Title mb-5' transition={"ease-in 0.5s"} color={!isDarkMode ? "#fff" : "dark.text"}>Square is better with frineds, so find some!</Text>
                </div>

                <div className='d-flex flex-column  justify-content-center align-items-center'>
                    <Box
                        bg={!isDarkMode ? "dark.text" : "dark.primary"}
                        transition={"ease-in 0.5s"}
                        className="search-group px-5 d-flex mx-3 my-2 flex-row justify-content-center align-items-center card">
                        <Input
                            bg={!isDarkMode ? "#fff" : "dark.accent"}
                            transition={"ease-in 0.5s"}
                            type="text"
                            placeholder="Search a friend"
                            className="form form-control my-2 mx-2"
                            style={{ width: "400px" }}
                            value={searchUSN}
                            onChange={(e) => setSearchUSN(e.target.value)}
                        />
                        <button className="btn btn-primary search-btn py-0" onClick={getUserData}>
                            Search
                        </button>
                    </Box>


                    {dataFound ?
                        <div>
                            {console.log(userData)}
                            {userData.map((user, index) => {
                                return (<UserComponent key={index}
                                    username={user.username}
                                    profilePicture={user.dp}
                                    following={user.following}
                                    followers={user.followers}
                                    isDarkMode={isDarkMode}
                                    requestSent={user.requestSent}
                                    requestReceived={user.requestReceived}
                                    currentUser={currentUser}
                                    handleUnfollow={handleUnfollow}
                                    handleSentRequest={handleSentRequest}
                                />)
                            })
                            }
                        </div>
                        : ""
                    }
                </div>

            </Box>
        </>
    );
};

function UserComponent({ username, following, followers, profilePicture, isDarkMode,
    requestReceived, requestSent, currentUser, handleUnfollow, handleSentRequest }) {
    // const [isSent, setisSent] = useState(requestReceived.includes(currentUser));
    // const [areFriends, setAreFriends] = useState();
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Box
            className='card card-body profile-group my-2'
            bg={!isDarkMode ? "#fff" : "dark.accent"}
        >
            <Box className='d-flex justify-content-center flex-row'>
                <Box className={'d-flex w-50 align-items-center ms-5'}>
                    <Box className={isLoading ? "loading-dp" : 'rounded-cricle'}>
                        <ImageComponent imgSrc={profilePicture} handleLoading={() => setIsLoading(false)} isDp={true} width={50} />
                    </Box>
                    <p className='usn mx-2 mt-3'>{username}</p>
                </Box>
                <Box className='ms-auto align-items-center ms-auto me-3 d-flex'>
                    {followers.includes(currentUser) ? <button className='btn btn-primary me-2' onClick={() => handleUnfollow(username)}>{"Following"}</button> :
                        <button className={requestReceived.includes(currentUser) ? 'btn btn-secondary me-3' : 'btn btn-primary me-3'} onClick={() => handleSentRequest(username)}>
                            {requestReceived.includes(currentUser) ? <FaCheck className="me-1" /> : ""}
                            {requestReceived.includes(currentUser) ? "Sent" : "Follow"}
                        </button>
                    }
                </Box>
            </Box>
        </Box>
    )
}

FindFriends.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    setIsDarkMode: PropTypes.func.isRequired,
};

export default FindFriends;
