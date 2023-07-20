const User = require('../models/users');

exports.register = async (req, res) => {
  const defaultProfile = "https://drive.google.com/uc?id=1kpsiTc_LblEgRLVHxUXP3CiR4GpuO2yJ&export=download";
  const username = req.body.usn;
  const password = req.body.pass;
  const dob = req.body.dob;
  const email = req.body.email;
  const name = req.body.name;
  const isReset = req.body.isReset;
  const isEmailVerify = req.body.isEmailVerify;

  try {
    if(isEmailVerify){
      const existingEmail = await User.findOne({ email });
      if(existingEmail){
        return res.status(200).json({message: false});
      }
      else
      {
        return res.status(200).json({message: true});
      }
    }
    else if(isReset){
      const user = await User.findOne({email});
      if(!user){
        return res.status(200).json({message: false})
      }
      else{
        return res.status(200).json({message: true})
      }
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'Username is already taken' });
    } else if (existingEmail) {
        return res.status(410).json({ message: 'Email is already taken' });
    }


    // Create a new user with the provided data
    const newUser = new User({
      username,
      name,
      dob,
      email,
      password,
      bio: "I'm loving it here",
      dp: defaultProfile,
      privacy: 'public',
      followers: [],
      following: [],
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
