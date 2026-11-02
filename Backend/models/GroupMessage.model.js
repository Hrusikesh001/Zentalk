import mongoose from 'mongoose'

const groupMessageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  receiver: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],

  message: {
    type: String,
    maxLength: 1000,
    trim: true,
  },

  attachment : [{
    attachmentUrl : {
      type : String,
    },
    attachmentMessage : {
      type : String,
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  }

}, {
  timestamps : true,
});


const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;




































