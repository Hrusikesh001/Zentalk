import { useEffect, useState } from "react";
import axios from "axios";
import useConversation from "../stateManage/useConversation.js";
import { useSocketContext } from "../context/socketContext.jsx";
import { useAuth } from "./AuthProvider";
import server from "../environment.js";

function useGetMessage() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setMessages } = useConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();

  const currentUserId = authUser?.user?._id;

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

        const fetchedMessages = res.data.messages || [];
        setMessages(fetchedMessages);

        // Mark incoming messages as read when this conversation is opened
        if (socket && currentUserId) {
          const unreadMessageIds = fetchedMessages
            .filter((message) => {
              const receiverId =
                typeof message.receiver === "object"
                  ? message.receiver?._id
                  : message.receiver;

              return (
                receiverId === currentUserId &&
                message.status !== "read"
              );
            })
            .map((message) => message._id);

          if (unreadMessageIds.length > 0) {
            socket.emit("message-read", {
              messageIds: unreadMessageIds,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, socket, currentUserId, setMessages]);

  const { messages } = useConversation();

  return {
    messages,
    loading,
  };
}

export default useGetMessage;