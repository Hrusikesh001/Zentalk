import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import frontend_url from '../envirnoment.js';
import Message from '../models/Message.model.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${frontend_url}`,
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const users = {};

// real time message

const getRecieverAndSenderSocketId = (receiverId) => {
  return users[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("New client connected:", socket.id, "User ID:", userId);

  if (userId) {
    users[userId] = socket.id;
  }

  io.emit("getOnline", Object.keys(users));

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
  });


    // Message delivered acknowledgement
  socket.on("message-delivered", async ({ messageId }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) return;

      // Only the intended recipient can acknowledge delivery
      if (message.receiver.toString() !== socket.handshake.query.userId) {
        return;
      }

      // Don't downgrade a message that has already been read
      if (message.status === "sent") {
        message.status = "delivered";
        message.deliveredAt = new Date();
        await message.save();
      }

      const senderSocketId = getRecieverAndSenderSocketId(
        message.sender.toString()
      );

      if (senderSocketId) {
        io.to(senderSocketId).emit("message-status-updated", {
          messageId: message._id,
          status: message.status,
          deliveredAt: message.deliveredAt,
          readAt: message.readAt,
        });
      }
    } catch (error) {
      console.error("Message delivery acknowledgement error:", error);
    }
  });


  // Message read acknowledgement
  socket.on("message-read", async ({ messageIds }) => {
    try {
      if (!Array.isArray(messageIds) || messageIds.length === 0) return;

      const currentUserId = socket.handshake.query.userId;

      for (const messageId of messageIds) {
        const message = await Message.findById(messageId);

        if (!message) continue;

        // Only the intended recipient can mark a message as read
        if (message.receiver.toString() !== currentUserId) {
          continue;
        }

        if (message.status !== "read") {
          message.status = "read";

          if (!message.deliveredAt) {
            message.deliveredAt = new Date();
          }

          message.readAt = new Date();
          await message.save();
        }

        const senderSocketId = getRecieverAndSenderSocketId(
          message.sender.toString()
        );

        if (senderSocketId) {
          io.to(senderSocketId).emit("message-status-updated", {
            messageId: message._id,
            status: "read",
            deliveredAt: message.deliveredAt,
            readAt: message.readAt,
          });
        }
      }
    } catch (error) {
      console.error("Message read acknowledgement error:", error);
    }
  });

  socket.on('call-ended', () => {
    const roomId = socket.roomId;
    socket.to(roomId).emit('call-ended');
  });

  socket.on("request-join-room", data => {

    console.log(data);
    const reveiverSocketId = getRecieverAndSenderSocketId(data.receiverId);

    io.to(reveiverSocketId).emit("send-join-requrst", data);

  });

  socket.on("call-rejected", (data) => {
    const senderSocketId = getRecieverAndSenderSocketId(data.senderId);
    io.to(senderSocketId).emit("call-rejected");
  });


  socket.on("send-friend-request", (data) => {
    const requestReceiverSocketId = getRecieverAndSenderSocketId(data.requestReceiverId);
    const requestReceiverId = data.requestReceiverId;
    const requestSenderDetails = data.requestSender;
    io.to(requestReceiverSocketId).emit("receive-friend-request", { requestSenderDetails });
  });

  socket.on("add-new-friend", (data) => {
    const { senderId, friend } = data;
    const senderSocketId = getRecieverAndSenderSocketId(senderId);
    io.to(senderSocketId).emit("add-new-friend", friend);
  });

  socket.on("friend-delete", (data) => {
    const { friendId, userId } = data;
    const friendSocketId = getRecieverAndSenderSocketId(friendId);
    io.to(friendSocketId).emit("friend-delete", { userId });
  });

  socket.on("request-group-join-room", data => {
    console.log(data);
    const {receiverIds} = data;
    receiverIds.forEach(userId => {
      const reveiverSocketId = getRecieverAndSenderSocketId(userId);
      io.to(reveiverSocketId).emit("send-join-requrst", data);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
        console.log(`Removed user ${id}`);
        break;
      }
    }

    io.emit("getOnline", Object.keys(users));
  });
});


export { app, io, server, getRecieverAndSenderSocketId }


















