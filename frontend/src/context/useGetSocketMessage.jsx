import { useEffect } from 'react';
import { useSocketContext } from '../context/socketContext.jsx';
import useConversation from '../stateManage/useConversation.js';
import sound from '../assets/notificationSound.mp3'

function useGetSocketMessage() {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      messages.push(newMessage);
      console.log(newMessage);
      const notification = new Audio(sound);
      notification.play();
      setMessages(messages);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages, messages]);

  return null;
}

export default useGetSocketMessage;
