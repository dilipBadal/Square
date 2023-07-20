const Chats = require('../models/chats'); // Assuming you have a Chats model defined
const User = require('../models/users');

exports.fetchChatHeads = async (req, res) => {
    try {
        const currentUser = req.query.currentUser;
        const chatList = await Chats.findOne({ username: currentUser }, 'chat')
        .then((user) => {
        if (user) {
            return user.chat; // Access the chat array
        } else {
            return null; // Or any other appropriate value if user not found
        }
        })
        .catch((error) => {
        return null; // Or any other appropriate value in case of an error
        });

        if(!chatList){
          return res.status(200).json({messages: "No Chats to load"});
        }

      // Fetch dp field from the user collection for each chat
        const chatData = await Promise.all(
            chatList.map(async (chat) => {
                // Find the user document in the User collection based on the chat username

                const userDoc = await User.findOne({ username: chat.username });
                
                // Extract dp field from the user document
                const dp = userDoc ? userDoc.dp : null;

                return {
                username: chat.username,
                lastMessage: (chat.messages[chat.messages.length - 1] ? chat.messages[chat.messages.length - 1] : "Start a Convo"),
                dp: dp,
            };
        })
        );

      // Return the chatHeads as the response
      res.status(200).json(chatData);
    } catch (error) {
      console.error('Error fetching chat heads:', error);
      res.status(500).json({ error: 'Failed to fetch chat heads' });
    }
  };
  