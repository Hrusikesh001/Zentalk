import { useEffect, useState } from 'react';
import axios from 'axios';
import useConversation from '../stateManage/useConversation.js';
import server from '../environment.js';

function useGetMessage() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setMessages } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          `${server}/message/get/${selectedConversation._id}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
      setLoading(false);
    };

    getMessages();
  }, [selectedConversation]);

  const { messages } = useConversation();

  return {
    messages,
    loading,
  };
}

export default useGetMessage;
