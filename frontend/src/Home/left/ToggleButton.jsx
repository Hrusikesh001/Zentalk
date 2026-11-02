import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthProvider';
import Edit from '../../components/Edit';
import Dialog from '@mui/material/Dialog';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import ChatInterface from '../Group/createGroup.jsx';
import { useDrawer } from '../../context/DrawerContext.jsx';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BasicModal from '../AddFriend/addFriend.jsx';
import ViewFriendRequest from '../AddFriend/viewRequests.jsx';
import DeleteForm from '../right/DeleteAccountForm.jsx';
import { transformImage } from '../../lib/features.js';

export default function TemporaryDrawer() {
  const [editOpen, setEditOpen] = React.useState(false);
  const [createGroupOpen, setCreateGroupOpen] = React.useState(false); 

  const [addFriendOpen, setAddFriendOpen] = React.useState(false);
  const handleAddFriendOpen = () => setAddFriendOpen(true);
  const handleAddFriendClose = () => setAddFriendOpen(false);

  const [viewFriendOpen, setViewFriendOpen] = React.useState(false);
  const handleViewFriendOpen = () => setViewFriendOpen(true);
  const handleViewFriendClose = () => setViewFriendOpen(false);

  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);
  const handleDeleteAccountOpen = () => setDeleteAccountOpen(true);
  const handleDeleteAccountClose = () => setDeleteAccountOpen(false);

  const { authUser, setAuthUser } = useAuth();
  const { open, setOpen } = useDrawer();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleEditClick = () => {
    setEditOpen(true);
    setOpen(false);
  };

  const handleCreateGroupClick = () => {
    setCreateGroupOpen(true);
    setOpen(false);
  }

  const handleChatClick = () => {
    setOpen(false);
    navigate('/');
  }

  

  if (createGroupOpen) {
    return <Navigate to="/create-group" />
  }


  const DrawerList = (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#020617',
        color: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      {/* Current Section */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
        marginBottom: 1
      }}>
        <Avatar
          alt={authUser?.user?.username}
          src={transformImage(authUser?.user?.profilePicURL)}
          sx={{ width: 40, height: 40 }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            ml: 2,
            fontWeight: 'medium',
            color: 'white'
          }}
        >
          {authUser?.user?.username}
        </Typography>
      </Box>

      {/* Menu Items */}

      <Box sx={{ flexGrow: 1 }}>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            },
            transition: 'background-color 0.3s ease',
            mb: 1
          }}

          onClick={handleChatClick}
        >
          <ChatIcon sx={{ color: 'white' }} />
          <Typography
            variant="subtitle1"
            sx={{
              ml: 2,
              fontWeight: 'medium',
              color: 'white'
            }}
          >
            Chat
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            },
            transition: 'background-color 0.3s ease',
            mb: 1
          }}
          onClick={handleEditClick}
        >
          <EditIcon sx={{ color: 'white' }} />
          <Typography
            variant="subtitle1"
            sx={{
              ml: 2,
              fontWeight: 'medium',
              color: 'white'
            }}
          >
            Edit Details
          </Typography>
        </Box>



        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            },
            transition: 'background-color 0.3s ease',
            mb: 1
          }}

          onClick={handleCreateGroupClick}
        >
          <GroupIcon sx={{ color: 'white' }} />
          <Typography
            variant="subtitle1"
            sx={{
              ml: 2,
              fontWeight: 'medium',
              color: 'white'
            }}
          >
            Create Group
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            },
            transition: 'background-color 0.3s ease',
            mb: 1
          }}
          onClick={handleAddFriendOpen}
        >
          <PersonAddIcon sx={{ color: 'white' }}/>
          <Typography
            variant="subtitle1"
            sx={{
              ml: 2,
              fontWeight: 'medium',
              color: 'white'
            }}
          >
            Add Friend
          </Typography>
        </Box>


        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            },
            transition: 'background-color 0.3s ease',
            mb: 1
          }}
          onClick={handleViewFriendOpen}
        >
          <PlaylistAddIcon sx={{ color: 'white' }} />
          <Typography
            variant="subtitle1"
            sx={{
              ml: 2,
              fontWeight: 'medium',
              color: 'white'
            }}
          >
            View Requests
          </Typography>
        </Box>

      </Box>

      {/* Delete User account */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: '4px'
          },
          transition: 'background-color 0.3s ease',
          mt: 'auto',
          mb: 2
        }}

        onClick={() => {
          handleDeleteAccountOpen();
        }}
      >
        <DeleteIcon sx={{ color: '#ef4444' }} />
        <Typography
          variant="subtitle1"
          sx={{
            ml: 2,
            fontWeight: 'medium',
            color: '#ef4444'
          }}
        >
          Delete Account
        </Typography>
      </Box>
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          color: 'white',
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DensitySmallIcon />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#020617'
          }
        }}
      >
        {DrawerList}
      </Drawer>

      {/* Full-screen Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: '#020617',
            color: 'white'
          }
        }}
      >
        <Edit onClose={() => setEditOpen(false)} />
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setCreateGroupOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: '#020617',
            color: 'white'
          }
        }}
      >
        <Edit onClose={() => setCreateGroupOpen(false)} />
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setChatOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: '#020617',
            color: 'white'
          }
        }}
      >
        <Edit onClose={() => setChatOpen(false)} />
      </Dialog>
      <BasicModal open={addFriendOpen} onClose={handleAddFriendClose} />
      <ViewFriendRequest open={viewFriendOpen} onClose={handleViewFriendClose}/>
      <DeleteForm open={deleteAccountOpen} onClose={handleDeleteAccountClose}/>
    </div>
  );
}