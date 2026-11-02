import React from 'react'
import { useEffect } from 'react';
import { useSocketContext } from '../context/socketContext';
import { useCallContext } from '../context/CallContext';
import useConversation from '../stateManage/useConversation';
import toast from 'react-hot-toast';


function CallSocketListener() {

  const {socket} = useSocketContext();
  const {setCallData, setShowNotification} = useCallContext();
  const {selectedConversation, typeOfCall, setTypeOfCall} = useConversation();

  useEffect(() => {

    if (!socket) return;

    const handleJoinRequest = (data) => {
      console.log(data);
      setShowNotification(true);
      setCallData(data);
      console.log();
      setTypeOfCall(data.callType);
    }

    const handleCallRejected = () => {
      toast.error("User is currently busy!");
    }

    socket.on("send-join-requrst", handleJoinRequest);
    socket.on("call-rejected", handleCallRejected);
    
    return () => {
      socket.off("send-join-requrst", handleJoinRequest);
      socket.off("call-rejected", handleCallRejected);
    }


  }, [socket, setCallData, setShowNotification]); 

  return null;
}

export default CallSocketListener