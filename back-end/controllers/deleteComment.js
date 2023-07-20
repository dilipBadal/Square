const Post = require('../models/posts');
const mongoose = require('mongoose');

exports.deleteComment = async (req, res) => {
  const postUSN = req.body.postUSN;
  const commentId = req.body.commentId;
  const postId = req.body.postId;

  try {
    // Find the document with postUSN in the posts collection
    const user = await Post.findOne({ username: postUSN });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the specific post within the posts array based on the postId
    const post = user.posts.find((p) => p._id.equals(new mongoose.Types.ObjectId(postId)));
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the specific comment within the comments array based on the commentId
    const commentIndex = post.comments.findIndex((c) => c._id.equals(new mongoose.Types.ObjectId(commentId)));
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Delete the comment from the comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await user.save();

    // Return the updated comments list
    res.json(post.comments);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
