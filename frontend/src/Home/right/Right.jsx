import React from 'react'
import Chatuser from './Chatuser'
import Messages from './Messages'
import Type from './Type'
import GroupUsers from './GroupUsers.jsx'
import useConversation from '../../stateManage/useConversation.js'

export default function Right() {
  const { openGroupUsers } = useConversation();

  return (
    <div className='w-[75%] bg-slate-950 text-white flex flex-col h-screen'>
      <Chatuser />
      {openGroupUsers === 'true' ? (
        <GroupUsers className="flex-1 overflow-y-auto" />
      ) : (
        <>
          <Messages className="flex-1" />
          <Type />
        </>
      )}
    </div>
  )
}