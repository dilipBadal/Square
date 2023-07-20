// Import the necessary modules and models
const User = require('../models/users');

// Controller function to handle request acceptance
exports.handleFollowRequest = async (req, res) => {
  const { isAccepted, sender, currentUser } = req.body;


  try {
    // Find the sender and current user in the users collection
    const senderUser = await User.findOne({ username: sender });
    const currentUserData = await User.findOne({ username: currentUser });

    // Remove the current user from the requestSent list of the sender
    senderUser.requestSent = senderUser.requestSent.filter((username) => username !== currentUserData.username);

    // Remove the sender from the requestReceived list of the current user
    currentUserData.requestReceived = currentUserData.requestReceived.filter((username) => username !== senderUser.username);

    if (isAccepted) {
      // If the request is accepted, add the sender to the currentUserData's followers list
      currentUserData.followers.push(senderUser.username);
      senderUser.following.push(currentUserData.username);
    }

    // Save the changes to both user documents
    await senderUser.save();
    await currentUserData.save();

    // Send a response indicating success
    res.status(200).json({ message: 'Request handled successfully' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.log('Error handling request:', error);
    res.status(500).json({ error: 'An error occurred while handling the request' });
  }
};