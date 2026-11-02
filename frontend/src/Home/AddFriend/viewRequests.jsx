import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import SendIcon from '@mui/icons-material/Send';
import { List, ListItem, ListItemAvatar, ListItemText, Divider, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import useGetRequests from '../../context/useGetRequests.js'
import toast from 'react-hot-toast'
import axios from 'axios';
import userGetAllUsers from '../../context/userGetAllUsers.jsx';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useSocketContext } from '../../context/socketContext.jsx';
import useConversation from '../../stateManage/useConversation.js';
import { transformImage } from '../../lib/features.js';
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


export default function ViewFriendRequest({ open, onClose }) {

  const { users } = useGetRequests();
  const [requests, setRequests] = React.useState(users || []);
  const { authUser } = useAuth();
  const { socket } = useSocketContext();
  const { allFriends, setAllFriends } = useConversation();

  React.useEffect(() => {
    setRequests(users || []);
  }, [users]);


  const handleRequest = async (userId, value, sender) => {
    console.log(`Friend request sent to user ${userId}`);


    try {
      const { data } = await axios.post(
        `${server}/requests/handleRequestSubmits`,
        {
          senderId: userId,
          value
        },
        { withCredentials: true }
      );

      if (value) {
        toast.success("Friend Added!");

        const friendDetails = {
          senderId: userId,
          friend: authUser.user,
        }

        socket.emit("add-new-friend", friendDetails);

        if (!allFriends) {
          setAllFriends([sender]);
        } else {
          allFriends.push(sender);
          setAllFriends(allFriends);
        }


      } else {
        toast.success("Request Rejected");
      }

      setRequests((previousRequests) => {
        previousRequests.filter((user) => user.requestSender._id !== userId);
      });

    } catch (err) {
      console.log(err);
    }

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
            Find Requests
          </Typography>
          <List sx={{ width: '100%', bgcolor: '#111827' }}>
            {requests?.length > 0 && requests.map((user) => (
              <React.Fragment key={user.requestSender._id}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <Grid container alignItems="center" justifyContent="center" spacing={2}>
                    <Grid item xs={12} sm={'auto'}>
                      <ListItemAvatar>
                        <Avatar alt={user.requestSender.name} src={transformImage(user.requestSender.profilePicURL)} sx={{ width: 48, height: 48 }} />
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
                              {user.requestSender.name}
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
                              ID: {user.requestSender.username}
                            </Typography>
                          </React.Fragment>
                        }
                        sx={{ my: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleRequest(user.requestSender._id, true, user.requestSender)}
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
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PersonAddDisabledIcon />}
                          onClick={() => handleRequest(user.requestSender._id, false, user.requestSender)}
                          sx={{
                            color: '#fff',
                            borderColor: '#4f46e5',
                            '&:hover': {
                              borderColor: 'red',
                              backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            },
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2,
                            width: { xs: '100%', sm: 'auto' }
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
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