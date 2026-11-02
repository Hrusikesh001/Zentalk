import React from 'react'
import axios from 'axios'
import { useSocketContext } from './socketContext';
import server from '../environment.js';

function useGetRequests() {

  const [users, setUsers] = React.useState([]);
  const {socket} = useSocketContext();
  
  React.useEffect(() => {

    const findUsers = async () => {
      try {
        const { data } = await axios.post(
          `${server}/requests/getRequests`,
          {},
          { withCredentials: true }
        );

        setUsers(data.users);
        
      } catch (err) {
        console.log(err);
      }
    };
    findUsers();
  }, []);

  React.useEffect(() => {
    if (!socket) return;
    const handleFriendRequest = (data) => {
      const details = {
        requestSender : data.requestSenderDetails
      }
      users.push(details);
      setUsers(users);
    }

    socket.on("receive-friend-request", handleFriendRequest);

    return () => {
      socket.off("receive-friend-request", handleFriendRequest);
    }
  }, [socket]);

  return {
    users
  };
}

export default useGetRequests