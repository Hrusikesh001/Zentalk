import React, { useEffect } from 'react'
import useConversation from '../../stateManage/useConversation.js'
import { useSocketContext } from '../../context/socketContext.jsx'
import { transformImage } from '../../lib/features.js';

function User({ user, isUser }) {
  const { selectedConversation, setSelectedConversation, setOpenGroupUsers } = useConversation();

  useEffect(() => {
    setOpenGroupUsers("false");
  }, [selectedConversation, setSelectedConversation]);

  const isSelected = selectedConversation?._id === user._id

  const { socket, onlineUser } = useSocketContext();

  let isOnline = false;

  if (isUser) {
    isOnline = onlineUser.includes(user._id);
  }

  if (isUser) {
    return (
      <div className={`flex space-x-4 px-4 py-6 hover:bg-slate-600 hover:duration-300 hover:cursor-pointer ${isSelected ? "bg-slate-700" : ""} `}
        onClick={() => setSelectedConversation(user)}
      >
        <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
          <div className="w-12 h-12 rounded-full">
            <img src={`${transformImage(user.profilePicURL)}`} />
          </div>
        </div>

        <div className='py'>
          <h1 className='font-bold'>
            {user.username}
          </h1>
          <span>{user.name}</span>
        </div>

      </div>
    )
  }

  return (
    <div className={`flex space-x-4 px-4 py-6 hover:bg-slate-600 hover:duration-300 hover:cursor-pointer ${isSelected ? "bg-slate-700" : ""} `}
      onClick={() => setSelectedConversation(user)}
    >
      <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
        <div className="w-12 h-12 rounded-full">
          <img src={`${transformImage(user.groupProfileImage)}`} />
        </div>
      </div>

      <div className='py'>
        <h1 className='font-bold'>
          {user.groupName}
        </h1>
        <span>Group</span>
      </div>

    </div>
  )
}

export default User