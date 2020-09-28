const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger')(module);

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    birthday: {
      type: Date,
      require: true,
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { versionKey: false }
);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Unable to login');
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'Bearer');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.generateUserToSave = async function (reqUser) {
  reqUser.birthday = new Date(reqUser.birthday);
  reqUser.password = await bcrypt.hash(reqUser.password, saltRounds);
  return reqUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
