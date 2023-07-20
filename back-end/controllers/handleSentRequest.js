const User = require('../models/users');

exports.handleSentRequest = async (req, res) => {
  const postUser = req.body.postUser;
  const viewer = req.body.viewer;

  if(!postUser){
    try{
      const user = await User.findOne({ username: viewer });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const requestReceived = user.requestReceived;

      return res.status(200).json({requestReceived: requestReceived})
      }
      catch(er){
        return res.status(404).json({message: "user not found"});
      }
  }

  try {
    const user = await User.findOne({ username: postUser });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requestReceived = user.requestReceived;

    // Check if the viewer username is already in the requestReceived list
    const index = requestReceived.indexOf(viewer);
    if (index !== -1) {
      // Viewer username found, remove it from the list
      requestReceived.splice(index, 1);
    } else {
      // Viewer username not found, add it to the list
      requestReceived.push(viewer);
    }

    // Save the updated user
    await user.save();


    // Handle for 2nd user
    try {
      const sentUser = await User.findOne({ username: viewer });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const requestSent = sentUser.requestSent;

    // Check if the viewer username is already in the requestReceived list
    const index = requestSent.indexOf(postUser);
    if (index !== -1) {
      // Viewer username found, remove it from the list
      requestSent.splice(index, 1);
    } else {
      // Viewer username not found, add it to the list
      requestSent.push(postUser);
    }

    await sentUser.save();

    }catch(er){
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({requestReceived: user.requestReceived});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
