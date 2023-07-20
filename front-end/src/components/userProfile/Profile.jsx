/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Box, Text, FormLabel } from '@chakra-ui/react';
import Navbar from '../navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import ImageComponent from '../ImageComponent';
import Post from '../homepage/post/Post';
import PostForm from '../homepage/PostForm';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-image-crop/dist/ReactCrop.css';
import './profile.css';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const ProfilePage = ({handleChatsToggle, isDarkMode, setIsDarkMode}) => {
  const location = useLocation();
  const [token, setToken] = useState(location.state.token);
  const [postUser] = useState(location.state.username);
  const [viewer] = useState(location.state.currentUser);
  const [isAuth, setIsAuth] = useState();
  const [privacy, setPrivacy] = useState('');
  const [areFriends, setAreFriends] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [postCount, setPostCount] = useState();
  const [dob, setDob] = useState();
  const [email, setEmail] = useState();
  const [bio, setBio] = useState();
  const [editState, setEditState] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [name, setName] = useState();
  const [previewImage, setPreviewImage] = useState(null)
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [requestSent, setRequestSent] = useState();
  const [showPopUp, setShowPopUp] = useState(true);
  const [isPrivate, setIsPrivate] = useState();
  const [dp, setDp] = useState();
  const [age, setAge] = useState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();

  const getUserDetails = async () => {
    try {
      const response  = await api.get("/api/socialSquare/getUserData", {params: {username: postUser}});
      if(response.status == 200){
        setAreFriends(response.data.followers.includes(viewer));
        setBio(response.data.bio);
        setFollowersCount(response.data.followers.length);
        setFollowingCount(response.data.following.length);
        setRequestSent(response.data.requestReceived.includes(viewer));
        setPostCount(response.data.postCount);
        setName(response.data.name);
        console.log(response.data.privacy);
        setIsPrivate((response.data.privacy === "private"));
        setPrivacy(response.data.privacy);
        setEmail(response.data.email);
        setDp(response.data.dp);

        // Formatting Date for Dob and age
        const dob = response.data.dob; // Assuming the response data contains the date of birth in the format "YYYY-MM-DDT00:00:00.000Z"

        // Calculate the age
        const birthDate = new Date(dob);
        const month = birthDate.toLocaleString('default', { month: 'short' });
        const day = birthDate.getDate();
        const year = birthDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        setDob(formattedDate);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();

        // Adjust the age based on the current month and day
        if (currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        // The 'age' variable now holds the calculated age
        setAge(age);
      }
    }
    catch (er){
      // alert('Error getting user details')
    }
  }


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== null) {
      setToken(storedToken);
      setIsAuth(true);
      getUserDetails();
    }
    else {
      console.log("Not logged in");
      setIsAuth(false);
      // setShowPopUp(true)
    }
  }, [postUser, viewer]);


  const closePopup = () => {
    if(!isAuth){
      navigate('/login');
      setShowPopUp(false);
    }
  };

  const handleChangeDp = (event) => {
    const file = event.target.files[0];

    if (file && file.type && file.type.startsWith('image/')) {
      // The file is an image
      console.log('File is an image');
    } else {
      // The file is not an image
      alert("Selected type is not supported");
      return
    }

    const imgname = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });
            setPreviewImage(URL.createObjectURL(file));
            setSelectedImage(file); // Store the file itself
          },
          "image/jpeg",
          0.8
        );
      };
    };
    setShowPreview(true);
  }

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleDpUpload = async () => {
    try{
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('dp', true);

      const response = await api.post('/api/socialSquare/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      });

      if(response.status == 200){
        alert("Upload Complete");
      }
    }
    catch(er){
      console.log(er.response.data);
      alert(er.response);
    }
  }

  const handleRequest = async () => {
    try{
      const response = await api.post('/api/socialSquare/handleSentRequest', {viewer, postUser});
      if(response.status == 200){
        setRequestSent(response.data.requestReceived.includes(viewer));
      }
    }
    catch(er){
      console.log(er.response.data);
    }
  }

  const removeFollowing = async () =>{
    try{
      const response = await api.post('/api/socialSquare/removeFollowing', {viewer, postUser});
      if(response.status == 200){
        setAreFriends(false);
      }
    }
    catch(er){
      console.log(er.response.data);
    }
  }

  const handleDetailsChange = async () => {
    setEditState(!editState)
    if(editState){
      try{
        const response  = await api.post('api/socialSquare/detailsChange', {currentUser: viewer, bio: bio, name: name, privacy});
        if(response.status == 200){
          getUserDetails();
        }
      }
      catch(er){
        console.log("Error: " + er.response.data);
      }
    }
    
    
  }

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };

  return (
    <>
    <Navbar token={token} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
    <Box className="container-fluid px-0"  bg={!isDarkMode ? "#fff": "dark.background"} transition={"ease-in 0.5s"}>
    <Box className={(postUser != viewer && !areFriends) ? 'row mx-5 viewerView' : "row mx-5"}>
      <Box className={(postUser != viewer && !areFriends) ? 'col-12 mx-5 viewing' : 'col-md-6 d-none d-md-block'}>
        <Box className="card mt-4" bg={!isDarkMode ? "#fff": "dark.primary"} transition={"ease-in 0.5s"}>
          <Box className="card-header d-flex justify-content-around">
            <Box className='image-username'>

              <Box className=''>
                <Box className={isLoading ? 'loading-dp' : ''}>
                  <label htmlFor="dpHolder"
                  className="profilePictureContainer rounded-circle"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  >
                    {
                    showPreview ? 
                    <img
                    src={previewImage}
                    alt="Preview"
                    className="previewImage img-fluid rounded-circle"
                    style={{ maxWidth: '150px', maxHeight: '150px', display: 'block', objectFit: 'contain' }}
                  /> 
                  : (dp ? <ImageComponent imgSrc={dp} width={200} isDp={true}/> : '') }

                  {hovered && (postUser == viewer) && (
                    <Box className="dimLayer rounded-circle">
                      <span className="text">
                      <FontAwesomeIcon icon={faCamera} className="cameraIcon" />
                      </span>
                    </Box>
                  )}
                  </label>

                  {(postUser==viewer) ? 
                  <input type="file" id="dpHolder" className='d-none' onChange={handleChangeDp}/> 
                  :  "" }
                </Box>

              </Box>

            {(editState ? 
            <input type="text" value={name}  onChange={(e) => setBio(e.target.value)}/> 
                : 
                <Text  className='text-center'
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                >{name}</Text >
            )}

            {showPreview ? <button className='btn btn-primary' onClick={handleDpUpload}>Save</button> : ""}
            </Box>

            <Box className="follow-following info mx-5 w-50 my-5  d-flex justify-content-between align-items-center">
              <Box className='mx-2'>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='text-center bold' style={{fontSize: "2rem"}}>{postCount}</Text>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='text-center'>Posts</Text>
              </Box>

              <Box className='mx-2'>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='text-center bold' style={{fontSize: "2rem"}}>{followingCount}</Text>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='text-center'>Following</Text>
              </Box>

              <Box className='mx-2'>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='text-center bold' style={{fontSize: "2rem"}}>{followersCount}</Text>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='text-center'>Followers</Text>
              </Box>
            </Box>
          </Box>

          <Box className="card-body">
            <Box className="about-section">
              <Box className="top-section d-flex justify-content-between">
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='about-title'>About</Text>

                {/*Account Status*/}
                <Box>
                  {editState ? 
                  <>
                  <Box className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="privacy" 
                    id="private" value="private" checked={privacy === 'private'}
                    onChange={handlePrivacyChange} />
                    <FormLabel 
                    color={!isDarkMode ? "": "dark.text"}
                    transition={"ease-in 0.5s"}
                    className="form-check-label" htmlFor="private">Private</FormLabel>
                </Box>
                <Box className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="privacy"
                     id="public" value="public" checked={privacy === 'public'}
                     onChange={handlePrivacyChange} />
                    <FormLabel
                    color={!isDarkMode ? "": "dark.text"}
                    transition={"ease-in 0.5s"}
                    className="form-check-label" htmlFor="public">Public</FormLabel>
                </Box></> : <button className='btn btn-secondary'>{isPrivate ? "Private": "Public"}</button>
                  }
                </Box>

                {/* Conditionally render follow or edit button */}
                { (postUser==viewer) ?
                  <button className='btn btn-primary edit-save-btn' onClick={handleDetailsChange}>
                    {editState ? "Save" : "Edit"}
                  </button> : 
                  (areFriends ? 
                    <button className='btn btn-primary' onClick={removeFollowing}>
                      Following
                    </button>  : 
                    <button className={requestSent ? 'btn btn-secondary' : 'btn btn-primary'} onClick={handleRequest}>
                      {requestSent ? <FaCheck className="me-1" /> : ""}
                      {requestSent ? "Sent" : "Follow"}
                    </button>) 
                }              
   
              </Box>
              <Box className="bio mt-2">
                <Text
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='heading'>Bio</Text>
                {(editState ? <input type="text" value={bio}  onChange={(e) => setBio(e.target.value)}/> 
                : <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='border p-2'>{bio}</Text>)}
              </Box>
              <Box className="dob d-flex justify-content-between">

                <Box className='text-center d-flex flex-column'>
                <Text
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='heading'>Date of Birth</Text>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='mx-5'>{dob}</Text>
                </Box>

                <Box className='text-center d-flex flex-column'>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='heading'>Age</Text>
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                className='mx-5'>{age}</Text>
                </Box>

              </Box>
              <Box className="contact">
                <Text 
                color={!isDarkMode ? "": "dark.text"}
                transition={"ease-in 0.5s"}
                >Contact</Text>
                <Box className='d-flex'>
                  <Box>
                    <Text 
                    color={!isDarkMode ? "": "dark.text"}
                    transition={"ease-in 0.5s"}
                    className='mx-3 my-2 heading'>E-mail</Text>
                    {
                      (areFriends || postUser == viewer) ? <Text 
                      color={!isDarkMode ? "": "dark.text"}
                      transition={"ease-in 0.5s"}
                      className='mx-5 my-2'>{email}</Text> : <Text
                      color={!isDarkMode ? "": "dark.text"}
                      transition={"ease-in 0.5s"}
                      className='mx-5 my-2'>*Not visible if not following</Text>
                    }
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Box className="col-md-6">
      {(token ? 
      <Box>
      {(postUser == viewer) ? <PostForm token={token} isDarkMode={isDarkMode}/> : null}
      {((areFriends || (postUser == viewer)) ? <Post currentUser={postUser} token={token} handleChatsToggle={handleChatsToggle} self={true} isDarkMode={isDarkMode}/> 
      : <Text
      color={!isDarkMode ? "": "dark.text"}
      transition={"ease-in 0.5s"}
      className='mx-5 my-2 text-center bg-primary'>*Follow user to see their posts</Text>)}
      </Box>: "")}
    </Box>
      
    </Box>
  </Box>

    </>
  );
};

export default ProfilePage;
