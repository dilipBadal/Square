const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
    default: "I'm loving it here",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dp: {
    type: String,
    default: "https://drive.google.com/uc?id=1kpsiTc_LblEgRLVHxUXP3CiR4GpuO2yJ&export=download",
  },
  privacy: {
    type: String,
    default: "public",
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  requestSent: {
    type: [String],
    default: [],
  },
  requestReceived: {
    type: [String],
    default: [],
  },
  gender: {
    type: String,
    default: "Rather not Say"
  },
  
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;