// Assuming you have a Post model/schema defined for the post collection
const Post = require('../models/posts');
const mongoose = require('mongoose');

// POST /api/socialSquare/fetchComments
exports.fetchComments = async (req, res) => {
  try {
    const postId = req.query.postId;
    const username = req.query.postUsername;

    // Find the post document based on the postUsername
    const post = await Post.findOne({ username: username });


    if (!post) {
      return res.status(400).json({ error: 'Post not found' });
    }

    // Find the specific post within the posts array based on the postId
    const specificPost = post.posts.find((p) => p._id.equals(new mongoose.Types.ObjectId(postId)));

    if (!specificPost) {
      return res.status(400).json({ error: 'Specific post not found' });
    }

    const comments = specificPost.comments;

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
