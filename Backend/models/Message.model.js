import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  message: {
    type: String,
    maxLength: 1000,
    trim: true,
  },

  attachment: [{
    attachmentUrl: {
      type: String,
    },
    attachmentMessage: {
      type: String,
    }
  }],

  // Message delivery and read receipts
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },

  deliveredAt: {
    type: Date,
    default: null,
  },

  readAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }

}, {
  timestamps: true,
})

const Message = mongoose.model('Message', messageSchema)

export default Message