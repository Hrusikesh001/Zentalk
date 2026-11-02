import { useEffect, useState } from "react";
import axios from "axios";
import useConversation from "../stateManage/useConversation";
import server from "../environment.js";

function useGetGroupMessages() {
  const { selectedConversation, setGroupMessages } = useConversation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getGroupMessages = async () => {
      if (!selectedConversation?.groupName) {
        setGroupMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const groupId = selectedConversation._id;

      try {
        const res = await axios.post(
          `${server}/groupMessage/getGroupMessage`,
          {groupId},
          { withCredentials: true }
        );

        setGroupMessages( res.data.messages || []);

      } catch (err) {
        console.error("Error fetching messages:", err);
        setGroupMessages([]);
      }
      setLoading(false);
    };

    getGroupMessages();

  }, [selectedConversation, setGroupMessages]);

  const {groupMessages} = useConversation();

  return {
    groupMessages,
    loading,
  }
}

export default useGetGroupMessages



























