const User = require('../models/users');

exports.removeFollowing = async (req, res) => {
  const { viewer, postUser } = req.body;

  try {
    const viewerUser = await User.findOne({ username: viewer });
    const postUserData = await User.findOne({ username: postUser });

    // Remove viewer username from postUserData's followers list
    postUserData.followers = postUserData.followers.filter(follower => follower !== viewer);

    // Remove postUserData username from viewer's following list
    viewerUser.following = viewerUser.following.filter(following => following !== postUserData.username);

    // Save the changes
    await postUserData.save();
    await viewerUser.save();

    return res.status(200).json({ message: 'Follower and following relationship removed successfully' });
  } catch (error) {
    console.log('Error removing follower and following:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
