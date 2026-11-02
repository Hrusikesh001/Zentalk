import Conversation from "../models/conversation.model.js";
import Message from "../models/Message.model.js";
import { getRecieverAndSenderSocketId } from "../SocketIO/server.js";
import { io } from "../SocketIO/server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, attachment } = req.body;
    const { id: receiver_id } = req.params;
    const sender_id = req.user._id;

    if (!message || !message.trim()) {
      if (attachment.length < 0) {
        return res.status(400).json({ message: "message and attachment can not be empty" });
      }
    }


    if (!receiver_id || !sender_id) {
      return res.status(400).json({ message: "Users not found!" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender_id, receiver_id] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender_id, receiver_id],
        messages: [],
        attachments : []
      });
    }

    let newMessage = {};

    if (message) {
      newMessage = await Message.create({
        sender: sender_id,
        receiver: receiver_id,
        message: message,
      });
    }else{
      newMessage = await Message.create({
        sender: sender_id,
        receiver: receiver_id,
        attachment: attachment,
      });
    }

    newMessage = await newMessage.populate({
      path: 'sender',
      select: 'username name email profilePicURL'
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // message sending to socket
    const receiverSocketId = getRecieverAndSenderSocketId(receiver_id);
    const senderSocketId = getRecieverAndSenderSocketId(sender_id);

    if (receiverSocketId && senderSocketId) {
      io.to(receiverSocketId).to(senderSocketId).emit("newMessage", newMessage);
    } else if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json({ message: "Message send successfully", newMessage });

  } catch (err) {
    console.log("Error in sending message " + err);
    res.status(500).json({ message: "Internal Server error!" });
  }
}


export const getMessage = async (req, res) => {
  try {
    const { id: receiver_id } = req.params;
    const sender_id = req.user._id;

    if (!receiver_id || !sender_id) {
      return res.status(400).json({ message: "Users not found!" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [receiver_id, sender_id] }
    }).populate({
      path: 'messages',
      populate: [
        { path: 'sender', select: 'username name email' },
      ]
    });

    if (!conversation) {
      return res.status(201).json({ message: "No conversation found" });
    }

    const messages = conversation.messages;

    res.status(201).json({ messages });


  } catch (err) {
    console.log("Error in getMessage : ", err);
    res.status(500).json({ message: "Internal server error!" });
  }
}
























