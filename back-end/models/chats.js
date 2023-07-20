const mongoose = require('mongoose');

const chatsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  chat: [
    {
      username: {
        type: String,
        required: true,
      },
      messages: [
        {
          sender: {
            type: String,
            required: true,
          },
          message: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const Chats = mongoose.model('Chats', chatsSchema);
module.exports = Chats;
