import React from 'react'
import useConversation from '../stateManage/useConversation'
import {useState} from 'react'
import axios from 'axios'
import server from '../environment.js'

function useSendMessage() {

  const [loading, setLoading] = useState(false);
  const {selectedConversation} = useConversation();

  const sendMessage = async (message = "", attachment=[]) => {
    setLoading(true);
    if(selectedConversation && selectedConversation._id){
      try{
        const res = await axios.post(
        `${server}/message/send/${selectedConversation._id}`,
        {
          message,
          attachment
        },
        {withCredentials: true,}
        );
        setLoading(false);
      }catch(err){
        console.log("error in sendMessage : " , err);
        setLoading(false);
      }
    }else{
      setLoading(false);
    }
  }
  
  return {
    loading,
    sendMessage,
  };
}

export default useSendMessage