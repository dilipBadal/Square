/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button, Box, Text, Input } from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import { BiCommentDots, BiShareAlt } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import ImageComponent from '../../ImageComponent';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "./post.css";
import { Toast } from 'bootstrap';


const api = axios.create({
  baseURL: 'http://localhost:5000',
});

function Post({currentUser, token, handleChatsToggle, self, isDarkMode}) {
  const [posts, setPosts] = useState([]);
  const [sliceFrom, setSliceFrom] = useState(0);
  const [sliceTill, setSliceTill] = useState(5);
  const [isAllPostsLoaded, setIsAllPostsLoaded] = useState(false);
  const navigate = useNavigate();
  
  const [isAuth] = useState(token);
  const updateLikes = async (postId, currentUser, postUsername) => {
    try {
      const response = await api.post('/api/socialSquare/handleLikes', { postId, currentUser, postUsername });
      // Handle the updated post as needed
      if (response.status == 200){
        return (response.data.post.likes);
      }
    } catch (error) {
      showToastMessage(error.response.data.data);
      return error.response;
    }
}

  // api call function to delete a post
  const deletePost = async (postUsername, postId, imageSrc) => {

    try{
      const response = await api.post('/api/socialSquare/deletePost', {postUsername, postId, imageSrc});
      if(response.status == 200){
        fetchPost();
      }
    }
    catch (err){
      alert(err.response.message);
    }
  }

  function fetchPost(){
    if(self){
      api.get('/api/socialSquare/fetchPost', {params: {currentUser: currentUser, self: self}})
    .then(response => {
      const filteredPosts = response.data.filter((postList) => postList.length > 0);
      setPosts(filteredPosts);
    })
    .catch(error => {
      showToastMessage("The error is in Post and it is",false);
    });
    }
    else
    {
      api.get('/api/socialSquare/fetchPost', {params: {currentUser: currentUser, self: self}})
    .then(response => {
      const filteredPosts = response.data.filter((postList) => postList.length > 0);
      setPosts(filteredPosts);
    })
    .catch(error => {
      showToastMessage("The error is in Post and it is",false);
    });
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  const showToastMessage = (message, Successful) =>{
    
    (Successful ? toast.success(message, {position: "top-center",closeOnClick: true, 
    draggable: true, theme: "dark", autoClose: 3000,
    pauseOnHover: false,
    }) : toast.warn(message, {position: "top-center",closeOnClick: true, 
    draggable: true, theme: "dark", autoClose: 3000,
    pauseOnHover: false,
    }))
  }

  function loadMorePost(){
    let totalPosts = posts.flat().flat().length;
    if(sliceTill + 5 <= totalPosts){
      setSliceFrom(sliceTill);
      setSliceTill(sliceTill + 5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    else
    {

      window.scrollTo({ top: 0, behavior: "smooth" });
      if(sliceTill < totalPosts){
        setSliceFrom(sliceTill);
        setSliceTill(totalPosts);
        return
      }
      showToastMessage("You have caught up", true);
      setIsAllPostsLoaded(true);
    }
  }

  if(isAuth){
    return (
      <>
      {posts.flat().flat().slice(sliceFrom, sliceTill).map((post, index) => (
        <Box key={index} 
        bg={!isDarkMode ? "#fff": "dark.background"}
        >
          {
            <ShowPost
              key={post.postId}
              postId={post.postId}
              postUsername={post.username}
              postImgSrc={post.image}
              caption={post.caption}
              userImgSrc={post.dp}
              likes={post.likes}
              comments={post.comments}
              currentUser={currentUser}
              updateLikes={updateLikes}
              deletePost={deletePost}
              showToastMessage={showToastMessage}
              handleChatsToggle={handleChatsToggle}
              navigate={navigate}
              isDarkMode={isDarkMode}
            />
          }
        </Box>
      ))}
      <Box display={"flex"} justifyContent={"center"} my={5}>
      <Button className='btn btn-primary'
        _hover={{transform: "scale(1.3)", transition: "ease-out 0.3s"}}
        transform={"scale(1.0)"}
        bg={!isDarkMode ? "light.primary" : "dark.primary"}
        color="dark.text"
        transition="ease-out 0.3s"
        onClick={loadMorePost}
        >Load More</Button>
      </Box>
      </>
    );
  }
}

function ShowPost({userImgSrc,isDarkMode, postId,navigate, postUsername, showToastMessage, postImgSrc,caption, likes, currentUser, updateLikes, deletePost, handleChatsToggle}){
  const [likesCounter, setLikesCounter] = useState(likes.length - 1);
  const [likedUsers, setLikedUsers] = useState(likes); 
  const [isLiked, setLiked] = useState(likes.some((like) => like === currentUser));
  const [isShowComments, setShowComments] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [fetchedComments,setFetchedComments] = useState([]);

  // function to fetch comments of a post
  const fetchComments = async (postId, postUsername) => {
    try {
      const response = await api.get('/api/socialSquare/fetchComments', { params: { postId, postUsername } });
      return response.data; // Return the fetched comments
    } catch (error) {
      showToastMessage(error.response.data.message,false);
      throw error; // Throw the error to be handled by the caller
    }
  };

  const handleLikeClick = () => {
    // const likes = updateLikes(postId, currentUser, postUsername);
    updateLikes(postId, currentUser, postUsername)
    .then((likes) => {
      if (likes) {
        setLikesCounter(likes.length -1);
        setLikedUsers(...likes);
        // Check if the current user already liked the post
        const userLiked = likes.some((like) => like === currentUser);
        setLiked(userLiked);
      }
    })
    .catch((error) => {
      showToastMessage(error.response.data.message,false);
      // Handle error
    });
  };

  const handleCommentsClick = () => {
    setShowComments(!isShowComments);
  };

  const handleLoading = () => {
    setLoading(false);
  }

  // hook gets called when the isShowComments value changes.
  useEffect(() => {
    if (isShowComments) {
      fetchComments(postId, postUsername).then((comments) => {
        if(comments){
          setFetchedComments(comments);
        }
      })
    }
  }, [isShowComments]);

  const postComment = async (postUSN, postId, comment, currentUser) => {
    try {
      const response = await api.post('/api/socialSquare/postComment', {postUSN, postId, comment, currentUser});
      setFetchedComments(response.data);
      return response.data;
    } catch (error) {
      showToastMessage(error.response.data.message,false);
      throw error; // Throw the error to be handled by the caller
    }
  };

  const deleteComment = async (postUSN, commentId, postId) => {
    try{
      const response = await api.post('/api/socialSquare/deleteComment', {postUSN, commentId, postId});
      setFetchedComments(response.data);
      return response.data
    }
    catch (err){
      alert(err.response.message);
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToastMessage("Link copied", true);
      })
      .catch((error) => {
        showToastMessage("Failed to copy", false);
      });
  };

  const openChat = (postUsername, userImgSrc) => {
    handleChatsToggle(postUsername, userImgSrc)
  }
  
  function handleOpenProfile(){
    navigate('/profile', { state: { username: postUsername, isLoggedIn: true, currentUser: currentUser } });
  }

  return(
    <Box 
    bg={!isDarkMode ? "#fff": "dark.primary"}
    transition={"ease-in 0.5s"}
    className="row card shadow show-post justify-content-around align-items-center my-4">
      <ToastContainer />
      <Box className="row info bg-postColor">
        <Box className="col-auto mx-0" onClick={handleOpenProfile}>
          <Box className={isLoading ? 'loading-dp' : ''}>
            <ImageComponent imgSrc={userImgSrc} handleLoading={handleLoading} width={"60"} isDp={true}/>
          </Box>
        </Box>
        <Box className="col d-flex align-items-center flex-start mt-2 px-0 align-items-center">
          <h4 id="user-name" className="user-name mx-0"
          onClick={handleOpenProfile}
          style={{ fontSize: '25px', color: '#888', fontFamily: 'Helvetica, Arial, sans-serif', cursor: "pointer" }}>
            {postUsername}
          </h4>
          <Box className="ms-auto dropdown">
          <Button
            transition={"ease-in 0.5s"}
            color={!isDarkMode ? "light.text" : "dark.text"}
            bg={"transparent"}
            className="btn dropdown-toggle no-arrow"
            data-bs-toggle="dropdown"
            _hover={{bg: "transparent"}}
            _focus={{outline: "none"}}
            aria-expanded="false"
            type="button"
            fontSize={"30px"}
            id="dropdownMenuButton"
          >
            ...
          </Button>
          <Box className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            {
              (
                currentUser == postUsername ?
                <a className="dropdown-item" onClick={() => deletePost(postUsername, postId, postImgSrc)}>
                  Delete Post 
                </a> : 
                <a className="dropdown-item" onClick={() => openChat(postUsername, userImgSrc)}>
                  Chat 
                </a>
              )
            }
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={isLoading ? "loading" : "row-auto image px-0 d-flex flex-column justify-center align-items-center"}>
        <Box className='d-flex align-items-start px-4 caption w-100 my-0 border-bottom flex-wrap'>
        <Text className='my-0'
        color={!isDarkMode ? "": "dark.text"}
        transition={"ease-in 0.2s"}
        >{caption}</Text>
        </Box>
        <Box 
        bg={!isDarkMode ? "#fff": "dark.secondary"}
        transition={"ease-in 0.5s"}
        className='w-100 h-100 d-flex justify-content-center align-items-center img-container'>
         <ImageComponent imgSrc={postImgSrc} handleLoading={handleLoading} />
        </Box>
      </Box>

      <Box className="row reactions bg-postColor text-center border-top">
        <Box className="col">
          <button className="btn btn-link like-btn d-flex flex-row justify-content-center align-items-center" style={{ textDecoration: 'none' }} onClick={handleLikeClick}>
            {isLiked ? (
              <AiFillHeart className="img-fluid dp m-2" size={30} color="#FF0000" />
            ) : (
              <AiOutlineHeart className="img-fluid dp m-2" size={30} />
            )}
            <h5 className='likes-counter mt-1'>{likesCounter}</h5>
          </button>
        </Box>
        <Box className="col d-flex flex-row justify-content-center align-items-center">
          <button className="btn btn-link cmnt-btn d-flex ustify-content-center align-items-center" onClick={handleCommentsClick}>
          <BiCommentDots
              className="img-fluid dp m-2"
              color={isShowComments ? 'blue' : 'blue'}
              size={30}
            />
          </button>
        </Box>
        <Box className="col">
          <button className="btn btn-link share-btn" onClick={() => copyToClipboard(postImgSrc)}>
          <BiShareAlt className="img-fluid dp m-2" size={30}/>
          </button>
        </Box>
      </Box>

      {isShowComments && (
        <Box className="row comments">
          <CommentsComponent 
          allCommentsFetched={fetchedComments} 
          userImgSrc={userImgSrc} 
          postUSN={postUsername}
          postId={postId}
          currentUser={currentUser}
          postComment={postComment}
          deleteComment={deleteComment}
          isDarkMode={isDarkMode}
          />
        </Box>
      )}
    </Box>
  );
}

// Component to show comments
const CommentsComponent = ({ allCommentsFetched, postUSN, postId, currentUser, postComment, deleteComment, isDarkMode}) => {
  const [comment, setComment] = useState('');

  const handleSendComment = async () => {
    if (!comment.trim()) {
      alert('Cannot post an empty comment');
      return; // Return nothing if the comment is empty
    }

    await postComment(postUSN, postId, comment, currentUser);
    setComment('');
  };

  const handleCommentDelete = async (postUSN, commentId, postId) => {
    await deleteComment(postUSN, commentId, postId);
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <Box className="comments-component border-top pt-3">
      <Box className="comments-list">
        <Box className='d-flex flex-column align-items-start justify-content-between'>
        {allCommentsFetched.map((comment, index) => {
          return (
            <Box key={index} className='d-flex justify-content-start flex-row w-100 my-2'>
              {comment.profilePicture ? 
              <Box className='mx-4'>
              <ImageComponent imgSrc={comment.profilePicture} width={"40"} isDp={true}/>
              </Box>
              : ""}
              <Box className='px-3 pt-1 comment-section'
              bg={!isDarkMode ? "": "dark.secondary"}
              transition={"ease-in 0.5s"}
              >
                <h4 className=''>{comment.username}</h4>
                <p className='px-2'>{comment.comment}</p>
              </Box>
              {
                currentUser == postUSN || currentUser == comment.username ?  
                <button className='btn' onClick={() => handleCommentDelete(postUSN, comment._id, postId)}>
                  <FaTrash color={!isDarkMode ? "" : "dark.text"}/>
                </button>
                : ""
              }
            </Box>
          )
        })}

      <Box className="comment-input d-flex justify-content-end w-100 mb-3">
        <Input
          bg={!isDarkMode ? "#fff" : "dark.accent"}
          color={!isDarkMode ? "light.text" : "dark.text"}
          transition={"ease-in 0.5s"}
          type="text"
          placeholder="Say Something"
          className='w-100 mx-3'
          value={comment}
          onChange={handleCommentChange}
        />
        <button onClick={handleSendComment} className='btn comnt-btn'>Send</button>
      </Box>

    </Box>
    </Box>
    </Box>
  );
};



export default Post;
