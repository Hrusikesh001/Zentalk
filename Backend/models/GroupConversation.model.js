import mongoose from "mongoose";

const groupConversationSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupMessage',
    default: [],
  }],

  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupMessage',
    default: [],
  }]
}, {
  timestamps: true,
});


const GroupConversation = mongoose.model("GroupConversation", groupConversationSchema);

export default GroupConversation;































