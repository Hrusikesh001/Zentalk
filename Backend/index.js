import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser"
import messageRoute from "./route/message.route.js"
import { app, io, server } from "./SocketIO/server.js";
import { v2 as cloudinary } from 'cloudinary';
import groupRoute from './route/group.route.js'
import groupMessageRoute from './route/groupMessage.route.js'
import handleFriendRequest from './route/friendRequest.route.js'
import upload from "./middleware/multerHandler.js";
import fs from 'fs'
import frontend_url from "./envirnoment.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

app.use(cors({
  origin: `${frontend_url}`,
  credentials: true,
}));
app.use(express.json({ limit: "48kb" }));
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  await mongoose.connect(URI).then((data) => {
    console.log("Database is connected");
  }).catch((err) => console.log(err));;
}
main();

app.use("/user", userRoute);
app.use("/message", messageRoute);
app.use("/group", groupRoute);
app.use("/groupMessage", groupMessageRoute);
app.use("/requests", handleFriendRequest);

app.get("/getImage", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  });
});

app.post("/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
    });


    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
      else console.log("Local file deleted:", req.file.path);
    });

    res.json({
      message: "Uploaded to Cloudinary successfully",
      dataURL: result.secure_url
    });

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }

});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

























