import Group from '../models/Groups.model.js'

export const createNewGroup = async (req, res) => {
  const { groupName, groupUsers, groupProfileImage } = req.body.groupData;

  try {
    const groupData = await Group.create({ groupName, groupUsers, groupProfileImage });

    const populatedGroupData = await Group.findById(groupData._id).populate("groupUsers");

    res.status(201).json({ message: "Group Created", group: populatedGroupData });

  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const allGroupDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const groupDetails = await Group.find({groupUsers : userId}).populate('groupUsers');
    res.status(200).json({ message: "Group details fetched", groupDetails });
  } catch (err) {
    console.log("Error in allGroupDetails", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body.groupData;

    if (!groupId || !userId) {
      return res.status(400).json({ message: "Group ID and User ID are required." });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    group.groupUsers = group.groupUsers.filter(
      memberId => memberId.toString() !== userId
    );

    await group.save();

    res.status(200).json({ message: "User removed from group successfully.", group });
  } catch (error) {
    console.error("Error removing group member:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


export const addGroupMembers = async (req, res) => {
  const { membersId, groupId } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(500).json({ message: "Group Not Found!" });
    }

    const newMembers = membersId.filter(
      id => !group.groupUsers.some(existingId => existingId.equals(id))
    );

    if (newMembers.length > 0) {
      group.groupUsers.push(...newMembers);
      await group.save();
    }

    const groupData = await Group.findById(groupId).populate("groupUsers");

    res.status(200).json({ message: "User Added In Group!", groupData });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }

}


export const handleLeaveGroup = async (req, res) => {
  try{
    const {groupId} = req.body;
    const userId = req.user._id;

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {$pull: {groupUsers : userId}},
      {new : true}
    );

    if(!updatedGroup){
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      message: "You have successfully left the group",
      group: updatedGroup,
    });

  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}































