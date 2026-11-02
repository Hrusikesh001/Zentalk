import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  groupName : {
    type : String,
    default : ""
  },
  groupUsers : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
  }],
  groupProfileImage : {
    type : String,
    default : ""
  }
},{
  timestamps : true,
});

const Group = mongoose.model("group", groupSchema);

export default Group;































