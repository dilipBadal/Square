const Post = require('../models/posts');
const UserCollection = require('../models/users');
const mongoose = require('mongoose');

exports.postComment = async (req, res) => {
    const postUSN = req.body.postUSN;
    const postId = req.body.postId;
    const comment = req.body.comment;
    const currentUser = req.body.currentUser;

  try {

    const activeUser = await UserCollection.findOne({username: currentUser});

    // Find the document with postUSN in the posts collection
    const user = await Post.findOne({ username: postUSN });
    if (!user || !activeUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the specific post within the posts array based on the postId
    const post = user.posts.find((p) => p._id.equals(new mongoose.Types.ObjectId(postId)));

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const profilePicture = activeUser.dp;

    // Create a new comment object
    const newComment = {
      username: currentUser,
      comment: comment,
      profilePicture: profilePicture,
    };

    // Append the new comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post
    await user.save();

    // Return the updated comments list
    res.json(post.comments);
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
