import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
  },
  token: {
    type: String,
  },
  joinedOn: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("user", userSchema);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

export { User, generateToken };
