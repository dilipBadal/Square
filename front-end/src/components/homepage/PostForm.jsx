/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Input } from '@chakra-ui/react';
import axios from 'axios';

var msg  = ""

const PostForm = ({token, isDarkMode}) => {
  const [isAuth] = useState(token);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [previewImage, setPreviewImage] = useState(null)
  const navigate = useNavigate();
  
  const [caption, setCaption] = useState('');
  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
  }

  const showToastMessage = (message, Successful) =>{
    
    (Successful ? toast.success(message, {position: "top-center",closeOnClick: true, 
    draggable: true, theme: "dark", autoClose: 3000,
    pauseOnHover: false,
    }) : toast.warn(message, {position: "top-center",closeOnClick: true, 
    draggable: true, theme: "dark", autoClose: 3000,
    pauseOnHover: false,
    }))
  }

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedImage(file); // Store the file itself
    setPreviewImage(URL.createObjectURL(file));
    setShowPreview(true);
  } else {
    setSelectedImage(null);
    setShowPreview(false);
  }
};

  const api = axios.create({
    baseURL: 'http://localhost:5000',
  });

  const closePopup = () => {
    msg = ""
    setShowPopUp(false)
    if(!isAuth){
      navigate('/login');
    }
  };

  const handleClearPreview = () => {
    setSelectedImage(null);
    setShowPreview(false);
    setCaption('');
  };

const handleFormSubmit = async (event) => {

  if(selectedImage){
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('caption', event.target.postText.value);

    try {
      const response = await api.post('/api/socialSquare/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${isAuth}`,
        },
      });

      if(response.status == 200){
        msg = "Post Uploaded Successfully"
        setShowPopUp(true);
        showToastMessage("Post Uploaded Successfully", true);
        handleClearPreview();
      }
    } catch (error) {
      console.log(error.response.data);
      msg = error.response;
      showToastMessage(error.response.data,false)
    }
  }
  else{
    showToastMessage("No Image Selected", false)
  }
  };

  return (
    <Box 
    bg={!isDarkMode ? "#fff": "dark.primary"}
    transition={"ease-in 0.5s"}
    className="row card shadow mt-4">
    <ToastContainer />

      <form encType="multipart/form-data" method="POST" className=" rounded py-2 px-2" onSubmit={handleFormSubmit}>
        <Box className="d-flex justify-content-between align-items-center">
          <Input
            rows="4"
            cols="10"
            bg={!isDarkMode ? "#fff" : "dark.accent"}
            placeholder="What's on your mind?"
            transition={"ease-in 0.5s"}
            type="text"
            name="postText"
            id="post-box"
            className="post-box form-control me-3"
            value={caption}
            onChange={handleCaptionChange}
          />
          <button type="submit" name="Post" id="post" className="btn btn-primary" disabled={!selectedImage}>
            Post
          </button>
        </Box>
        <Box className="form-group uploadBTN d-flex justify-content-between align-items-start flex-column">
            <Box>
            <input
            type="file"
            name="file"
            id="fileToUpload"
            accept="image/*, video/*"
            className="fileToUpload form-control-file d-none"
            onChange={handleFileChange}
          />
          <label htmlFor="fileToUpload" className="btn">
            <img
              src="../../resources/icons/img1.png"
              alt="file upload icon"
              width="30px"
              className="img-fluid me-3"
              style={{ maxWidth: '35px' }}
            />
          </label>
            </Box>
          {showPreview && (
            <Box className="previewContainer w-100 d-flex align-items-center flex-column">
              <Box className='w-100 d-flex align-items-end'>
                <button type="button" className="btn-close ms-auto" aria-label="Close" id="clearPreview" onClick={handleClearPreview}></button> 
              </Box>
              <Box>
              <img
                src={previewImage}
                alt="Preview"
                className="previewImage img-fluid"
                style={{ maxWidth: '100%', maxHeight: '500px', display: 'block', objectFit: 'contain' }}
              />
              </Box>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default PostForm;
