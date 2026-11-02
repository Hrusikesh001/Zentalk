import * as React from 'react';
import useConversation from '../../stateManage/useConversation.js'
import { useSocketContext } from '../../context/socketContext.jsx';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthProvider.jsx';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCallContext } from '../../context/CallContext.jsx';
import { transformImage } from '../../lib/features.js';
import server from '../../environment.js';

function Chatuser() {
  const { selectedConversation, openGroupUsers, setOpenGroupUsers, typeOfCall, setTypeOfCall } = useConversation();
  const { socket, onlineUser } = useSocketContext();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { answerCall } = useCallContext();

  if (!selectedConversation) {
    return (
      <div />
    );
  }

  let isOnline = false;

  if (selectedConversation) {
    isOnline = onlineUser.includes(selectedConversation._id);
  }

  const handelVideoCallClick = async () => {
    setOpenGroupUsers("false");
    console.log("Clicked on video call!");
    const roomId = uuidv4();
    const receiverId = selectedConversation._id;
    const senderName = authUser.user.name;
    const senderId = authUser.user._id;

    const uid = Math.floor(Math.random() * 100000);

    try {
      const { data } = await axios.post(
        `${server}/user/generate-token`,
        {
          channelName: roomId,
          uid
        },
        { withCredentials: true }
      )

      const { token, appId } = data;

      const callType = 'personalCall';

      const details = {
        roomId,
        receiverId,
        senderName,
        senderId,
        callType
      }

      setTypeOfCall(callType);

      socket.emit("request-join-room", details);

      const answerCallData = {
        roomId,
        token,
        appId,
        uid,
      }
      answerCall(answerCallData);

      console.log("roomId : ", roomId);

      navigate("/call");

    } catch (err) {
      console.log(err);
    }

  }


  const handelGroupVideoCallClick = async () => {
    const receiverDetails = selectedConversation.groupUsers.filter((user) => user._id !== authUser.user._id);
    let receiverIds = [];
    receiverDetails.forEach((user) => {
      receiverIds.push(user._id);
    });
    console.log(receiverIds);

    const roomId = uuidv4();
    const senderName = selectedConversation.groupName;
    const senderId = authUser.user._id;
    const uid = Math.floor(Math.random() * 100000);

    try {
      const { data } = await axios.post(
        `${server}/user/generate-token`,
        {
          channelName: roomId,
          uid
        },
        { withCredentials: true }
      )

      const { token, appId } = data;

      const callType = 'groupCall'

      setTypeOfCall(callType);

      const details = {
        roomId,
        senderName,
        receiverIds,
        senderId,
        callType
      }

      console.log(details);

      socket.emit("request-group-join-room", details);

      const answerCallData = {
        roomId,
        token,
        appId,
        uid,
      }
      answerCall(answerCallData);

      navigate("/call");

    } catch (err) {
      console.log(err);
    }
  }

  if (selectedConversation.groupName) {
    return (
      <div className='flex bg-gray-900 hover:bg-gray-800 hover:duration-300 items-center h-20 px-4 transition-colors gap-4 justify-between' >
        <div className='flex items-center space-x-4'>
          <div className={`avatar cursor-pointer`}
            onClick={() => {
              if (openGroupUsers === "true") {
                setOpenGroupUsers("false");
              } else {
                setOpenGroupUsers("true");
              }
            }}
          >
            <div className="w-12 h-12 rounded-full">
              <img src={`${transformImage(selectedConversation.groupProfileImage)}`} />
            </div>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-white font-medium text-lg'>{selectedConversation.groupName}</h1>
            <span className={`text-sm text-gray-400`}>
              Group
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-4 text-gray-300'>
          <button className='p-2 hover:bg-gray-700 rounded-full transition-colors'>
            <CallIcon className="w-6 h-6" />
          </button>
          <button className='p-2 hover:bg-gray-700 rounded-full transition-colors'
            onClick={handelGroupVideoCallClick}
          >
            <VideocamIcon className="w-6 h-6" />
          </button>
        </div>

      </div>
    );
  }


  return (
    <div className='flex bg-gray-900 hover:bg-gray-800 hover:duration-300 h-20 justify-between items-center px-4 transition-colors z-20'>
      <div className='flex items-center space-x-4'>
        <div className={`avatar ${isOnline ? "avatar-online" : ""} cursor-pointer`}
          onClick={() => {
            if (openGroupUsers === "true") {
              setOpenGroupUsers("false");
            } else {
              setOpenGroupUsers("true");
            }
          }}
        >
          <div className="w-12 h-12 rounded-full">
            <img
              src={transformImage(selectedConversation.profilePicURL)}
              alt={selectedConversation.name}
              className="object-cover"
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <h1 className='text-white font-medium text-lg'>{selectedConversation.name}</h1>
          <span className={`text-sm ${isOnline ? "text-green-400" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className='flex items-center space-x-4 text-gray-300'>
        <button className='p-2 hover:bg-gray-700 rounded-full transition-colors'>
          <CallIcon className="w-6 h-6" />
        </button>
        <button className='p-2 hover:bg-gray-700 rounded-full transition-colors'
          onClick={handelVideoCallClick}
        >
          <VideocamIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default Chatuser;