const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  profilePicture: { type: String, required: true },
  caption: { type: String },
  likes: { type: Number, default: 0 },
  comments: [{
    username: { type: String, required: true },
    profilePicture: { type: String, required: true },
    comment: { type: String, required: true }
  }]
});

module.exports = mongoose.model('Post', postSchema);
