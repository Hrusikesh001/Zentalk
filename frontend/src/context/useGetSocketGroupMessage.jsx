import React from 'react'
import { useSocketContext } from './socketContext'
import useConversation from '../stateManage/useConversation'
import { useEffect } from 'react'

function useGetSocketGroupMessage() {
  const {socket} = useSocketContext();
  const {groupMessages, setGroupMessages} = useConversation();

  useEffect(() => {
    if(!socket) return;

    const handleNewMessage = (newMessage) => {
      setGroupMessages(prev => [...prev, newMessage]);
    }

    socket.on("newGroupMessage", handleNewMessage);

    return () => {
      socket.off("newGroupMessage", handleNewMessage);
    }

  }, [socket, groupMessages, setGroupMessages]);

  return null;
}

export default useGetSocketGroupMessage