import mongoose from "mongoose";
import {Schema} from 'mongoose'

const friendRequestSchema = new Schema({
  requestSender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  requestReceiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest;




























