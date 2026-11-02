import { useEffect } from "react";
import { useSocketContext } from "../context/socketContext.jsx";
import useConversation from "../stateManage/useConversation.js";
import { useAuth } from "./AuthProvider";
import sound from "../assets/notificationSound.mp3";

function useGetSocketMessage() {
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const { setMessages } = useConversation();

  const currentUserId = authUser?.user?._id;

  useEffect(() => {
    if (!socket || !currentUserId) return;

    // A new message was received
    const handleNewMessage = (newMessage) => {
      const senderId =
        typeof newMessage.sender === "object"
          ? newMessage.sender?._id
          : newMessage.sender;

      // Add it only if it isn't already in the current message list
      setMessages((currentMessages) => {
        const alreadyExists = currentMessages.some(
          (message) => message._id === newMessage._id
        );

        return alreadyExists
          ? currentMessages
          : [...currentMessages, newMessage];
      });

      // Acknowledge delivery only for messages sent by someone else
      if (senderId !== currentUserId) {
        socket.emit("message-delivered", {
          messageId: newMessage._id,
        });

        const notification = new Audio(sound);
        notification.play().catch((error) => {
          console.log("Notification sound could not play:", error);
        });
      }
    };

    // The sender receives an update when their message is delivered/read
    const handleMessageStatusUpdated = (statusUpdate) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === statusUpdate.messageId
            ? {
                ...message,
                status: statusUpdate.status,
                deliveredAt:
                  statusUpdate.deliveredAt ?? message.deliveredAt,
                readAt: statusUpdate.readAt ?? message.readAt,
              }
            : message
        )
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("message-status-updated", handleMessageStatusUpdated);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("message-status-updated", handleMessageStatusUpdated);
    };
  }, [socket, currentUserId, setMessages]);

  return null;
}

export default useGetSocketMessage;