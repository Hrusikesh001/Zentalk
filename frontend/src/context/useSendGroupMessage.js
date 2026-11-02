import React from 'react'
import useConversation from '../stateManage/useConversation'
import { useState } from 'react'
import axios from 'axios';
import { useAuth } from './AuthProvider';
import server from '../environment.js';

function useSendGroupMessage() {
  const { selectedConversation, groupMessages, setGroupMessages } = useConversation();
  const [loadingGroup, setLoadingGroup] = useState(false);
  const { authUser, setAuthUser } = useAuth();

  const sendGroupMessage = async (message = "", attachment=[]) => {
    setLoadingGroup(true);
    if (selectedConversation && selectedConversation.groupName) {
      const groupId = selectedConversation._id;
      try {
        const response = await axios.post(
          `${server}/groupMessage/sendGroupMessage`,
          { message, attachment, groupId },
          { withCredentials: true }
        );
      } catch (err) {
        console.log("Error at useSendGroupMessage:", err.message);
      } finally {
        setLoadingGroup(false); 
      }
    } else {
      setLoadingGroup(false);
    }
  }

  return {
    loadingGroup,
    sendGroupMessage
  }
}

export default useSendGroupMessage


































