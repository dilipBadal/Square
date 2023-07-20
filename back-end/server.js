const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const Chats = require('./models/chats');
const http = require('http');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/SocialSquare', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/api/socialSquare', routes);

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // event to handle msg being sent
  socket.on("sendMessage", async (data) => {

    let authorUser = await Chats.findOne({ username: data.sender });

    if (!authorUser) {
      // Create new chat history for the currentUser if not found
      authorUser = new Chats({
        username: data.sender,
        chat: [],
      });
    }

    let senderChat = authorUser.chat.find((chat) => chat.username === data.toWho);

    if (!senderChat) {
      // Create new chat history for the sender if not found
      senderChat = {
        username: data.toWho,
        messages: [],
      };
      authorUser.chat.push(senderChat);
    }

    // Append the message to the chat history for the currentUser and sender
    senderChat.messages.push({
      sender: data.sender,
      message: data.message,
    });

    await authorUser.save();

    /////////////////////////////////////////////////////////
    let receptant = await Chats.findOne({ username: data.toWho });

    if (!receptant) {
      // Create new chat history for the sender if not found
      receptant = new Chats({
        username: data.toWho,
        chat: [],
      });
    }

    let currentUserChatsList = receptant.chat.find((chat) => chat.username === data.sender);

    if (!currentUserChatsList) {
      // Create new chat history for the currentUser if not found
      currentUserChatsList = {
        username: data.sender,
        messages: [],
      };
      receptant.chat.push(currentUserChatsList);
    }

    // Append the message to the chat history for the sender
    currentUserChatsList.messages.push({
      sender: data.sender,
      message: data.message,
    });

    await receptant.save();

    const returnData = {
      _id: data._id,
      sender: data.sender,
      message: data.message,
    }

    // event handler for receiving msg 
    socket.to(data.room).emit("recieveMessage", returnData);
  });

  // event to handle room join
  socket.on("joinRoom", (data) => {
    socket.join(data);
  })

  // event to handle room left
  socket.on("roomleft", () => {
    socket.leave();
  });

  // Event handler for disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected now');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});