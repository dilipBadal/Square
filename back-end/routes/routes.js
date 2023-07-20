const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth');
const {register} = require('../controllers/register');
const {uploadPost} = require('../controllers/upload');
const {fetchPost} = require('../controllers/fetchPost')
const {handleLikes} = require('../controllers/handleLikes');
const {getImage} = require('../controllers/getImages');
const {fetchComments} = require('../controllers/fetchComments');
const {postComment} = require('../controllers/postComments');
const upload = require('./multer');
const { deleteComment } = require('../controllers/deleteComment');
const {deletePost} = require('../controllers/deletePost');
const {fetchSuggestions} = require('../controllers/fetchSuggestions');
const {fetchChats} = require('../controllers/fetchChats');
const {fetchChatHeads} = require('../controllers/fetchChatHeads');
const {getUserData} = require('../controllers/getUserData');
const {handleSentRequest} = require('../controllers/handleSentRequest');
const {handleFollowRequest} = require('../controllers/handleFollowRequest');
const {removeFollowing} = require('../controllers/removeFollower');
const {detailsChange} = require('../controllers/detailsChange');
const {sendOTP} = require('../controllers/sendOTP');
const {reset} = require('../controllers/reset');

//APi to Login
router.post('/login', login);

//Api to Register
router.post('/register', register);

//Api to Upload
router.post('/upload', upload.single('file'), uploadPost);

//Api to Fetch Post
router.get('/fetchPost', fetchPost);

//Api to handle likes
router.post('/handleLikes', handleLikes);

//Api to get images from Gdrive and return the blob object
router.get('/getImage', getImage);

//Api to fetch comments
router.get('/fetchComments', fetchComments);

//Api to post a comment
router.post('/postComment', postComment);

//Api to delete a comment
router.post('/deleteComment', deleteComment);

//Api to delete a post
router.post('/deletePost', deletePost);

//Api to fetch Suggestions
router.get('/fetchSuggestions', fetchSuggestions);

//Api to fetch Chats
router.get('/fetchChats', fetchChats)

//Api to fetch chat heads
router.get('/fetchChatHeads', fetchChatHeads);

//Api to fetch user data
router.get('/getUserData', getUserData);

//Apit to handle request being sent
router.post('/handleSentRequest', handleSentRequest);

//Api to accept or delete follow requests
router.post('/handleFollowRequest', handleFollowRequest);

//Api to remove follower
router.post('/removeFollowing', removeFollowing);

//Api to update user details
router.post('/detailsChange', detailsChange);

//Api to send OTP
router.post('/sendOTP', sendOTP);

//Apit to reset password
router.post('/reset', reset);

module.exports = router;
