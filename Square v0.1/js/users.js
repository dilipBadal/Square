const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true,},
  password: {type: String, required: true,},
  email: {type: String, required: true, unique: true,},
  dob: {type: Date, required: true,},
  following: {type: [String], default: null,
    validate: {
      validator: function(arr) {
        return arr === null || arr.length === new Set(arr).size;
      },
      message: 'Following list cannot have duplicate values.',
    },
  },
  followers: {type: [String], default: null,
    validate: {
      validator: function(arr) {
        return arr === null || arr.length === new Set(arr).size;
      },
      message: 'Followers list cannot have duplicate values.',
    },
  },
});

module.exports = mongoose.model('User', UserSchema);
