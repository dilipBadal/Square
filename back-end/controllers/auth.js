const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    // Check if user doesn't exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
       // Generate the JWT token
       const secretKey = 'gamer33d@123';
       const payload = { username: user.username };
       const token = jwt.sign(payload, secretKey);

       // Save the username in the backend
       user.lastLoggedInUsername = user.username;

       await user.save();
 
       // Return the token to the client
       return res.json({ token, username });
    } else {
      // If passwords don't match, return an error response
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
