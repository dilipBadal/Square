const Post = require('../models/posts');
const mongoose = require('mongoose');
// Add a like to a post
exports.handleLikes = async (req, res) => {
  try {
    const postId = req.body.postId;
    const currentUser = req.body.currentUser;
    const postUser = req.body.postUsername;

    // Find the post by postId
    const user = await Post.findOne({ username: postUser });

    if (!user) {
        return res.status(500).json({ message: 'User not found' });
    }
    
    const post = user.posts.find((p) => p._id.equals(new mongoose.Types.ObjectId(postId)));
    
    if (!post) {
      return res.status(500).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const userLiked = post.likes.some((like) => like === currentUser);

    if (userLiked) {
      // User already liked the post, remove their like
      post.likes = post.likes.filter((like) => like !== currentUser);
    } else {
      // User has not liked the post, add their like
      post.likes.push(currentUser);
    }
    
    // Save the updated post
    await user.save();

    return res.status(200).json({ post: post});
  } catch (error) {
    console.error('Error updating like:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
