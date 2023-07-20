const User = require('../models/users');

exports.detailsChange = async (req, res) => {
  const { currentUser, bio, name, privacy } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username: currentUser },
      { bio, name, privacy },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
