import React from 'react'
import { useCallContext } from '../context/CallContext.jsx'
import { CallNotification } from './GetCallNotification.jsx'
import { useSocketContext } from '../context/socketContext.jsx';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import useConversation from '../stateManage/useConversation.js';
import server from '../environment.js';

function GlobalCallNotification() {
  const { callData, showNotification, answerCall, endCall} = useCallContext();
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const {typeOfCall} = useConversation();

  const handleCallAccept = async () => {
    const uid = Math.floor(Math.random() * 100000);
    try {
      const { data } = await axios.post(
        `${server}/user/generate-token`,
        {
          channelName: callData.roomId,
          uid
        },
        { withCredentials: true }
      )

      const { token, appId } = data;

      answerCall({
        roomId: callData.roomId,
        uid,
        token,
        appId
      });
      navigate("/call");
    } catch (err) {
      console.log(err);
    }

  }

  const handleCallReject = () => {
    if(typeOfCall === 'personalCall'){
      socket.emit("call-rejected", { senderId: callData.senderId });
      endCall();
    } 
  }

  if (!showNotification || !callData) return null;

  return (
    <CallNotification
      caller={{ name: callData.senderName }}
      onAccept={handleCallAccept}
      onReject={handleCallReject}
    />
  )
}

export default GlobalCallNotification