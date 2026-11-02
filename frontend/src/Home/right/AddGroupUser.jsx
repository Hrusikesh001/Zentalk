import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LeftSidebar from '../Group/leftContent.jsx'
import { useAuth } from '../../context/AuthProvider.jsx';
import useConversation from '../../stateManage/useConversation.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import animationData from '../../assets/loading.json';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import userGetAllUsers from '../../context/userGetAllUsers.jsx';
import server from '../../environment.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  minWidth: '400px',
  maxWidth: '600px',
  height: '70vh',
  bgcolor: '#111827',
  borderRadius: '8px',
  border: '1px solid #1f2937',
  boxShadow: 24,
  p: 0,
  display: 'flex',
  flexDirection: 'column',
};

export default function NestedModal() {
  const [notGroupUsers, setNotGroupUsers] = React.useState([]);
  const [allUsers] = userGetAllUsers();
  const { authUser } = useAuth();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setUsers([]);
  };

  React.useEffect(() => {
    if (!selectedConversation || !selectedConversation.groupUsers) return;
    
    const filteredUsers = allUsers?.filter(
      (allUser) => !selectedConversation.groupUsers.some(
        (groupUser) => groupUser._id === allUser._id
      )
    );
    setNotGroupUsers(filteredUsers);
  }, [selectedConversation, allUsers]);

  const addGroupMembers = async () => {
    if (users.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${server}/group/addGroupMembers`,
        {
          groupId: selectedConversation._id,
          membersId: users
        },
        { withCredentials: true }
      );
      handleClose();
      setSelectedConversation(response.data.groupData);
      toast.success("Members added to group successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        onClick={handleOpen}
      >
        <GroupAddIcon fontSize="small" />
        Add Member
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-member-modal"
        aria-describedby="add-member-to-group"
      >
        <Box sx={style}>
          {!loading ? (
            <>
              <div className="flex-1 overflow-hidden">
                <LeftSidebar
                  getSelectedUsers={setUsers}
                  allUsers={notGroupUsers}
                />
              </div>
              <div className="p-4 border-t border-slate-700 flex justify-end">
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  onClick={addGroupMembers}
                  disabled={users.length === 0}
                >
                  <PersonAddIcon fontSize="small" />
                  Add {users.length > 0 ? `(${users.length})` : ''} Members
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div style={{ width: 200, height: 200 }}>
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                />
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}