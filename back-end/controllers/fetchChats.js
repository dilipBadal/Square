const Chats = require('../models/chats');

exports.fetchChats = async (req, res) => {
    try {
      const currentUser = req.query.currentUser;
      const username = req.query.username;
  
      // Find the document with the currentUser as the username
      const currentUserChat = await Chats.findOne({ username: currentUser });
  
      if (!currentUserChat) {
        // If the currentUser's chat document is not found, return an empty array
        return res.status(200).json([])
      }
  
      // Find the chat with the provided username in the currentUser's chat document
      const chat = currentUserChat.chat.find((chat) => chat.username === username);
  
      if (!chat) {
        // If the chat with the provided username is not found, return an empty array
        return res.status(200).json([]);
      }
  
      const messages = chat.messages;
  
      // Return the messages list
      return res.status(200).json(messages);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  