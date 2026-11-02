import GroupMessage from "../models/GroupMessage.model.js";
import GroupConversation from "../models/GroupConversation.model.js";
import Group from "../models/Groups.model.js";
import { getRecieverAndSenderSocketId, io } from "../SocketIO/server.js";

export const sendGroupMessage = async (req, res) => {
  try {
    const { message, attachment, groupId } = req.body;
    const sender_id = req.user._id;

    if (!message || !message.trim()) {
      if (attachment.length < 0) {
        return res.status(400).json({ message: "message and attachment can not be empty" });
      }
    }

    if (!groupId || !sender_id) {
      return res.status(400).json({ message: "Missing sender or group ID" });
    }

    let groupDetails = await Group.findById(groupId);

    let conversation = await GroupConversation.findOne({ groupId });

    const receiver_ids = groupDetails.groupUsers.filter(id => !id.equals(sender_id));

    if (!conversation) {
      conversation = new GroupConversation({
        groupId,
        participants: groupDetails.groupUsers,
        messages: [],
        attachments: []
      });
      await conversation.save();
    }

    let newMessage = {};

    if (message) {
      newMessage = new GroupMessage({
        sender: sender_id,
        receiver: receiver_ids,
        message,
      });
    }else{
      newMessage = new GroupMessage({
        sender: sender_id,
        receiver: receiver_ids,
        attachment,
      });
    }

    newMessage = await newMessage.populate({
      path: 'sender',
      select: 'username name email profilePicURL'
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    // connection to socket

    let senderSocketId = getRecieverAndSenderSocketId(sender_id);
    let receiverSocketIds = [];

    receiver_ids.forEach((id) => {
      let receiver_id = getRecieverAndSenderSocketId(id);
      if (receiver_id) {
        receiverSocketIds.push(receiver_id);
      }
    });

    if (senderSocketId && receiverSocketIds.length > 0) {
      receiverSocketIds.forEach((receiverSocketId) => {
        if (receiverSocketId) {
          io.to(receiverSocketId).to(senderSocketId).emit("newGroupMessage", newMessage);
        }
      })
    } else {
      io.to(senderSocketId).emit("newGroupMessage", newMessage);
    }

    return res.status(200).json({
      message: "Message sent successfully",
      data: newMessage,
      conversationId: conversation._id
    });

  } catch (err) {
    console.error("sendGroupMessage error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.body;
    const sender_id = req.user._id;

    if (!groupId || !sender_id) {
      return res.status(400).json({ message: "Users not found!" });
    }

    const messageConversation = await GroupConversation.findOne(
      { groupId: groupId }
    ).populate({
      path: 'messages',
      populate: [
        { path: 'sender', select: 'username name email' },
      ]
    });

    if (!messageConversation) {
      return res.status(201).json({ message: "No conversation found" });
    }

    const messages = messageConversation.messages;

    res.status(201).json({ message: "messages found successfully", messages });


  } catch (err) {
    console.log("Error in getGroupMessage : ", err);
    res.status(500).json({ message: "Internal server error!" });
  }
}




























