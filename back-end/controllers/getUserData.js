const User = require('../models/users');
const Post = require('../models/posts');


exports.getUserData = async (req, res) => {
    try {
      const username = req.query.username;
      const isSearch = req.query.isSearch;
      const currentUser = req.query.currentUser;
      let postCount = 0;
      // Fetch user details

      let user;
      try {
        user = await User.find({ name: { $regex: username, $options: 'i' } }).exec();
        if (!user) {
          user = await User.find({ username: { $regex: username, $options: 'i' } }).exec();
        }
      } catch (error) {
        return res.status(404).json({error: 'User not found'});
      }

      if (isSearch) {
        // Remove currentUser from users
        const filteredUsers = user.filter(user => user.username !== currentUser);
        return res.status(200).json({ user: filteredUsers });
      }

      user = await User.findOne({ username }).exec();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Fetch post count
      const posts = await Post.findOne({ username });

      if(posts){
        postCount = posts.posts.length; 
      }

      // Prepare the user data object
      const userData = {
        username: user.username,
        name: user.name,
        email: user.email,
        bio: user.bio,
        email: user.email,
        dp: user.dp,
        privacy: user.privacy,
        followers: user.followers,
        following: user.following,
        postCount: postCount,
        dob: user.dob,
        gender: user.gender,
        requestSent: user.requestSent,
        requestReceived: user.requestReceived,
      };
  
      res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
  };
  