import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/Message.model.js";
import FriendRequest from '../models/FriendRequest.model.js'
import Friend from "../models/Friend.model.js";
import mongoose from "mongoose";
import pkg from 'agora-access-token'
const { RtcTokenBuilder, RtcRole } = pkg;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

export const signup = async (req, res) => {
  try {
    const { username, name, email, password, confirmpassword, profilePicURL } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      password: hash,
      profilePicURL
    });

    await newUser.save().then(() => {
      console.log("User saved successfully!");
    });

    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res)
      res.status(201).json({
        message: "User registered successfully.",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          profilePicURL: newUser.profilePicURL,
        }
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.active) {
      return res.status(404).json({ message: "Account deleted! Can not login!" });
    }

    const compPass = await bcrypt.compare(password, user.password);

    if (!compPass) {
      return res.status(404).json({ message: "Wrong password" });
    }

    createTokenAndSaveCookie(user._id, res);

    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicURL: user.profilePicURL
      }
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res, sendResponse = true) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: "/",
    });
    if (sendResponse) {
      return res.status(200).json({ message: "User successfully logged out!" });
    }
  } catch (e) {
    console.log(e);
    if (sendResponse) {
      res.status(500).json({ message: "Server error" });
    }
  }
}


export const getUserProfile = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const selectedUser = await Friend.findOne({ auther: loggedInUser }).select("-password").populate('friends');
    const filteredUsers = selectedUser?.friends;
    res.status(201).json({ filteredUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}


export const editUserProfile = async (req, res) => {
  try {
    const { username, name, email, password, profilePicURL } = req.body;
    const userId = req.user._id;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) {
      return res.status(404).json({ message: "Wrong password" });
    }

    if (email && email != user.email) {
      return res.status(403).json({ message: "Email cannot be modified" });
    }

    const updates = {
      username: username,
      name: name,
      profilePicURL: profilePicURL,
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select("-password");

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePicURL: updatedUser.profilePicURL,
      }
    });

  } catch (err) {
    console.log("Error at editUserProfile : ", err);
    res.status(500).json({ message: "Error updating profile" });
  }
}


export const deleteUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const deleteUser = await User.findById(userId);

    if (deleteUser) {
      deleteUser.name = 'Deleted Account';
      deleteUser.profilePicURL = 'https://www.gravatar.com/avatar/?d=mp&s=128';
      deleteUser.active = false;

      await deleteUser.save();

      console.log(deleteUser);
      console.log('User fields cleared and marked as inactive');

      await logout(req, res, false);

      res.status(200).json({ message: "User deleted!" });
    }

  } catch (err) {
    console.log("Error in delete : ", err);
    res.status(501).json({ message: "Server Error!" });
  }

}


export const findUsersByUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const senderId = req.user._id;

    if (!username?.trim()) {
      return res.status(400).json({ message: "Please provide a username." });
    }

    // Get all relevant data in parallel
    const [senderFriendDoc, sentRequests, receivedRequests] = await Promise.all([
      Friend.findOne({ auther: senderId }),
      FriendRequest.find({ requestSender: senderId }),
      FriendRequest.find({ requestReceiver: senderId })
    ]);

    // Initialize Set with senderId
    const excludedIds = new Set();
    excludedIds.add(senderId.toString());

    // Handle friends - convert to array if not already one
    if (senderFriendDoc?.friends) {
      const friendsArray = Array.isArray(senderFriendDoc.friends)
        ? senderFriendDoc.friends
        : [senderFriendDoc.friends];

      friendsArray.forEach(id => excludedIds.add(id.toString()));
    }

    // Add sent and received requests
    sentRequests.forEach(req => excludedIds.add(req.requestReceiver.toString()));
    receivedRequests.forEach(req => excludedIds.add(req.requestSender.toString()));

    // Find matching users not in excluded list
    const filteredUsers = await User.find({
      username: { $regex: `^${username}`, $options: "i" },
      _id: { $nin: Array.from(excludedIds).map(id => new mongoose.Types.ObjectId(id)) },
      active: true
    }).select('-password -__v');

    return res.status(200).json({
      success: true,
      message: "Users found!",
      users: filteredUsers
    });

  } catch (err) {
    console.error("Error in findUsersByUsername:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};


export const sendUsers = async (req, res) => {
  const { username } = req.body;
  const userId = req.user._id;
  try {
    const users = await User.find({
      username: { $regex: `^${username}`, $options: 'i' },
      active: true,
      _id: { $ne: userId }
    });
    res.status(200).json({ message: "Users found!", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
}



export const generateAgoraToken = (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || uid === undefined) {
    res.status(400).json({ error: "channelName or uid is not defined" });
  }

  const role = RtcRole.PUBLISHER;
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilageExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilageExpireTime
  );

  res.json({ token, appId: APP_ID });
}



export const confirmDeleteAccount = async (req, res) => {
  const { email, password } = req.body;
  const userId = req.user._id;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user._id.equals(userId)) {
    return res.status(404).json({ message: "Enter your email and password" });
  }

  const compPass = await bcrypt.compare(password, user.password);

  if (!compPass) {
    return res.status(404).json({ message: "Wrong password" });
  }

  const userDelete = true;
  return res.status(200).json({ message: "delete Account", userDelete });
}


export const deleteFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(400).json({ message: "Invalid friend ID" });
  }

  try {
    await Friend.findOneAndUpdate(
      { auther: userId },
      { $pull: { friends: friendId } }
    );

    await Friend.findOneAndUpdate(
      { auther: friendId },
      { $pull: { friends: userId } }
    );

    const conversations = await Conversation.find({
      participants: { $all: [userId, friendId], $size: 2 }
    });

    const messageIds = conversations.flatMap(conv => conv.messages);

    await Conversation.deleteMany({
      _id: { $in: conversations.map(conv => conv._id) }
    });

    await Message.deleteMany({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    });

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error("Error deleting friend:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const clearChat = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(400).json({ message: "Invalid friend ID" });
  }

  try{
    const conversations = await Conversation.find({
      participants: { $all: [userId, friendId], $size: 2 }
    });

    const messageIds = conversations.flatMap(conv => conv.messages);

    await Conversation.deleteMany({
      _id: { $in: conversations.map(conv => conv._id) }
    });

    await Message.deleteMany({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    });

    res.status(200).json({ message: 'chat cleared successfully' });
  }catch(err){
    console.error("Error deleting friend:", err);
    res.status(500).json({ message: "Server error" });
  }

}
































