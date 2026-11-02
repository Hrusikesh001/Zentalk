import { createContext, useContext, useEffect, useState, useRef } from "react";
import {io} from "socket.io-client";
import { useAuth } from "./AuthProvider";
import useConversation from "../stateManage/useConversation";
import toast from 'react-hot-toast'
import server from "../environment.js";

const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useAuth();
  const [onlineUser, setOnlineUser] = useState([]);
  const userIdRef = useRef(null); 
  const {allFriends, setAllFriends, selectedConversation, setSelectedConversation} = useConversation();

  const handleGetNewFriend = (data) => {
    toast.success(`${data.username} added to your FriendList`);
    allFriends.push(data);
    setAllFriends(allFriends);
  }

  const handleFriendDelete = (data) => {
    const {userId} = data;
    const updatedFriends = allFriends.filter(friend => friend._id !== userId )
    setAllFriends(updatedFriends);
  }

  useEffect(() => {
    if (!authUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setOnlineUser([]);
      }
      return;
    }

    const initializeSocket = () => {
      const newSocket = io(`${server}`, {
        query: {
          userId: authUser.user._id,
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        withCredentials: true,
      });

      console.log("Connecting socket for user:", authUser.user._id);
      
      newSocket.on("connect", () => {
        console.log("Socket connected with ID:", newSocket.id);
        userIdRef.current = authUser.user._id; 
      });

      newSocket.on("getOnline", (users) => {
        setOnlineUser(users);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      newSocket.on("add-new-friend", handleGetNewFriend);

      newSocket.on("friend-delete", handleFriendDelete);
      return newSocket;
    };

    if (!socket) {
      const newSocket = initializeSocket();
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }

    if (socket && userIdRef.current !== authUser.user._id) {
      socket.disconnect();
      const newSocket = initializeSocket();
      setSocket(newSocket);
    }

    
    return () => {};
  }, [authUser]); 
  return (
    <socketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </socketContext.Provider>
  );
};

export const useSocketContext = () => useContext(socketContext);