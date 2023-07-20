const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  
  posts: [
    {
      caption: String,
      likes: [],
      comments: [{
        profilePicture: String,
        username: String,
        comment: String,
      }],
      image: String,
      fileId: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
