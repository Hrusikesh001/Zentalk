import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const friendSchema = new Schema({
  auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, 

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }]
}, {
  timestamps : true,
});

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;









































