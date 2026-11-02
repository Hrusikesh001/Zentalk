import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useConversation from '../../stateManage/useConversation.js'
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddGroupUser from './AddGroupUser.jsx'
import { transformImage } from '../../lib/features.js';
import Avatar from '@mui/material/Avatar';
import ClearIcon from '@mui/icons-material/Clear';
import {useNavigate} from 'react-router-dom'
import { useSocketContext } from '../../context/socketContext.jsx';
import { useAuth } from '../../context/AuthProvider.jsx';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import server from '../../environment.js';

const MembersList = () => {
  const [activeMember, setActiveMember] = useState(null);
  const { selectedConversation, setSelectedConversation, setOpenGroupUsers, allGroups, setAllGroups } = useConversation();
  const navigate = useNavigate();
  const {allFriends, setAllFriends} = useConversation();
  const {socket} = useSocketContext();
  const {authUser} = useAuth();

  const handleDeleteFriend = async () => {
    try{
      const friendId = selectedConversation._id;
      const res = await axios.post(
        `${server}/user/deleteFriend`,
        {friendId},
        {withCredentials : true}
      );

      setSelectedConversation(null);

      const updatedFriends = allFriends.filter(friend => friend._id !== friendId )
      setAllFriends(updatedFriends);

      const details = {
        friendId,
        userId : authUser.user._id
      }

      socket.emit("friend-delete", details);
      
      toast.success("Friend Deleted!");
    }catch(err){
      console.log(err);
      toast.error("Error occured");
    }
  }

  const handleClearChat = async () => {
    try{
      const friendId = selectedConversation._id;
      const res = await axios.post(
        `${server}/user/clearChat`,
        {friendId},
        {withCredentials : true}
      );
      toast.success("Chat Cleared!");
    }catch(err){
      console.log(err);
    }
  }

  const handleLeaveGroup = async () => {
    try{
      const groupId = selectedConversation._id;
      const res = await axios.post(
        `${server}/group/leaveGroup`, 
        {groupId},
        {withCredentials : true}
      );

      setSelectedConversation(null);

      const updatedGroups = allGroups.filter((group) => group._id !== groupId);

      setAllGroups(updatedGroups);

      return toast.success("Group Left");
    }catch(err){
      console.log(err);
    }
  }

  if(!selectedConversation){
    return(
      <></>
    )
  }

  if (!selectedConversation?.groupUsers) {
    return (
      <div className='flex h-[90vh] w-[100%] bg-slate-950 p-6'>
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center">
              <Avatar
                alt={selectedConversation.name}
                src={transformImage(selectedConversation.profilePicURL, 500, 500)}
                sx={{ width: 250, height: 250 }}
              />
            </div>

            <div className="flex gap-2 flex-col">
              <p className="text-xl text-gray-200">{'Name : '+selectedConversation.name}</p>
              <p className="text-xl text-gray-200">{'Username : '+selectedConversation.username}</p>
              <p className="text-xl text-gray-200">{'Email : '+selectedConversation.email}</p>
            </div>

            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleDeleteFriend}
              >
                <DeleteIcon fontSize="small" />
                Delete Friend
              </button>
              <button
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleClearChat}
              >
                <ClearIcon fontSize="small" />
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteMember = () => {
    const groupData = {
      groupId: selectedConversation._id,
      userId: activeMember
    }

    axios.post(
      `${server}/group/removeGroupMember`,
      {
        groupData,
      },
      { withCredentials: true }
    )
      .then((response) => {
        toast.success("Member Removed");
        let userId = activeMember;
        const updatedGroups = allGroups.map(group => {
          if (group._id === response.data.group._id) {
            return {
              ...group,
              groupUsers: group.groupUsers.filter(
                user => (user._id || user) !== userId
              ),
            };
          }
          return group;
        });

        setAllGroups(updatedGroups);

        const updatedSelectedUser = {
          ...selectedConversation,
          groupUsers: selectedConversation.groupUsers.filter(user => user._id !== userId)
        };

        setSelectedConversation(updatedSelectedUser);
        console.log(allGroups);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className='flex h-[90vh] w-[100%] bg-slate-950 p-6'>
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Group Members</h2>
          <div className='flex flex-row gap-4'>
            <div>
              <AddGroupUser />
            </div>
            <div>
              <button
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors mr-[5vw]"
                onClick={handleLeaveGroup}
              >
                <PersonRemoveIcon fontSize="small" />
                Leave Group
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedConversation.groupUsers.map((member) => (
            <div
              key={member._id}
              className={`relative flex items-center p-3 rounded-lg mb-2 transition-colors ${activeMember === member._id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveMember(activeMember === member._id ? null : member._id)}
            >
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={transformImage(member.profilePicURL) || '/default-avatar.png'}
                    alt={member.username}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="ml-4 text-white flex-1">
                <p className="font-medium">{member.username}</p>
                {member.role && <p className="text-xs text-gray-400">{member.role}</p>}
              </div>

              {activeMember === member._id && (
                <button
                  className="ml-2 w-8 h-8 flex items-center justify-center transition-colors"
                  title="Remove member"
                  onClick={() => {
                    handleDeleteMember();
                  }}
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersList;