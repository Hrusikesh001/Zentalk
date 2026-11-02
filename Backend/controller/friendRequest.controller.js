import Friend from "../models/Friend.model.js";
import FriendRequest from "../models/FriendRequest.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

export const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const [senderExists, receiverExists] = await Promise.all([
      User.exists({ _id: senderId }),
      User.exists({ _id: receiverId })
    ]);

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    const senderFriendDoc = await Friend.findOne({ auther: senderId });

    if (senderFriendDoc && Array.isArray(senderFriendDoc.friends)) {
      const friendIds = senderFriendDoc.friends.map(id => id.toString());
      if (friendIds.includes(receiverId.toString())) {
        return res.status(400).json({ message: "You are already friends." });
      }
    }

    const existingRequest = await FriendRequest.findOne({
      requestSender: senderId,
      requestReceiver: receiverId
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const friendRequest = new FriendRequest({
      requestReceiver: receiverId,
      requestSender: senderId,
    });

    await friendRequest.save();

    res.status(201).json({ message: "Friend request sent successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};



export const getRequests = async (req, res) => {
  const authUserId = req.user._id;
  try {
    const users = await FriendRequest.find({ requestReceiver: authUserId }).populate('requestSender');
    res.status(200).json({ message: "Requests Retrived!", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}


export const handleRequestSubmits = async (req, res) => {
  const { senderId, value } = req.body;
  const receiverId = req.user._id;

  try {
    if (value === true) {

      await Friend.findOneAndUpdate(
        { auther: senderId },
        { $addToSet: { friends: receiverId } },
        { upsert: true, new: true }
      );

      await Friend.findOneAndUpdate(
        { auther: receiverId },
        { $addToSet: { friends: senderId } },
        { upsert: true, new: true }
      );

      await FriendRequest.findOneAndDelete({
        requestSender: senderId,
        requestReceiver: receiverId,
      });

      return res.status(200).json({ message: "Friend request accepted." });

    } else {
      const deleted = await FriendRequest.findOneAndDelete({
        requestSender: senderId,
        requestReceiver: receiverId,
      });

      if (deleted) {
        return res.status(200).json({ message: "Friend request rejected." });
      } else {
        return res.status(404).json({ message: "Friend request not found." });
      }
    }
  } catch (err) {
    console.error("Error handling request:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};



























