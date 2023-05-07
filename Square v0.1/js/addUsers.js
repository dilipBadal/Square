// create a new user document
// const newUser = new User({
//   username: 'johnDoe',
//   password: 'password123',
//   email: 'johnDoe@example.com',
//   dob: '1995-01-01',
// });

async function addNewUsers(usn, password, userEmail, userDob) {
    const mongoose = require('mongoose');
    const User = require('./users');
    // connect to the database
    var status = await mongoose.connect('mongodb://localhost:27017/testDB2', { useNewUrlParser: true, useUnifiedTopology: true });

    console.log(status);
    const newUser = new User({
      username: usn,
      password: password,
      email: userEmail,
      dob: userDob,
    });
  
    try {
      await newUser.save();
      console.log('User saved successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      mongoose.disconnect();
    }

    const users = await User.find({});
  console.log(users);

  mongoose.disconnect();
  }
  
  addNewUsers("dbadal123", "gamer33da", "princegamer48@gmail.com", "2001-09-03");


