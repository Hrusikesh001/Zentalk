import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { List, ListItem, ListItemAvatar, ListItemText, Divider, TextField, InputAdornment, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useSocketContext } from '../../context/socketContext';
import { useAuth } from '../../context/AuthProvider';
import { transformImage } from '../../lib/features';
import server from '../../environment.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '35vw',
  height: '80vh',
  bgcolor: '#111827',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  overflow: 'auto',
};


export default function BasicModal({ open, onClose }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const { socket } = useSocketContext();
  const { authUser } = useAuth();

  const handleSendRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        `${server}/requests/sendFriendRequest`,
        { receiverId: userId },
        { withCredentials: true }
      );

      let filteredArray = [];

      users.forEach((user) => {
        if (user._id !== userId) {
          filteredArray.push(user);
        }
      });

      setUsers(filteredArray);

      const requestData = {
        requestSender: authUser.user,
        requestReceiverId: userId,
      }

      socket.emit("send-friend-request", requestData);

      toast.success(data.message);

    } catch (err) {
      console.log(err);
      toast.error("Error occured");

    }
  };

  const handleSearch = async () => {

    if (!searchTerm || !searchTerm.trim()) {
      setUsers([]);
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/user/findUsers`,
        { username: searchTerm },
        { withCredentials: true }
      );

      if (data.users.length === 0) {
        toast.error("User not found!");
      }

      setUsers(data.users);

    } catch (err) {
      console.log(err);
      return toast.error("Server Error");
    }

    setSearchTerm('');
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{
            color: 'white',
            mb: 2,
            fontWeight: 'bold'
          }}>
            Find Friends
          </Typography>
          <Grid container spacing={2} alignItems="center" textAlign='center' justifyContent='center' sx={{ mb: 2 }}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#374151',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4f46e5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4f46e5',
                    },
                    backgroundColor: '#1f2937',
                    borderRadius: '8px',
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    py: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: '#4f46e5',
                  '&:hover': {
                    backgroundColor: '#4338ca',
                  },
                  textTransform: 'none',
                  borderRadius: '8px',
                  height: '40px',
                }}
              >
                Find User
              </Button>
            </Grid>
          </Grid>
          <List sx={{ width: '100%', bgcolor: '#111827' }}>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <ListItem alignItems='center' sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <Grid container alignItems="center" spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={'auto'}>
                      <ListItemAvatar>
                        <Avatar alt={user.name} src={transformImage(user.profilePicURL)} sx={{ width: 48, height: 48 }} />
                      </ListItemAvatar>
                    </Grid>
                    <Grid item xs={12} sm>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body1"
                              sx={{
                                color: 'white',
                                fontWeight: 'medium',
                                display: 'block',
                                mb: 0.5,
                                marginTop: 1
                              }}
                            >
                              {user.name}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: '#9ca3af',
                                fontSize: '0.75rem',
                                display: 'block'
                              }}
                            >
                              ID: {user.username}
                            </Typography>
                          </React.Fragment>
                        }
                        sx={{ my: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<SendIcon />}
                        onClick={() => handleSendRequest(user._id)}
                        sx={{
                          backgroundColor: '#4f46e5',
                          '&:hover': {
                            backgroundColor: '#4338ca',
                          },
                          textTransform: 'none',
                          borderRadius: '8px',
                          px: 2,
                          width: { xs: '100%', sm: 'auto' }
                        }}
                      >
                        Add Friend
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>

                <Divider variant="inset" component="li" sx={{ backgroundColor: '#1f2937', my: 1 }} />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Modal>
    </div>
  );
}