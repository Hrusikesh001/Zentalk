import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useConversation from '../stateManage/useConversation.js';
import server from '../environment.js';

function useGetAllGroups() {
  const {allGroups, setAllGroups} = useConversation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await axios.get(
          `${server}/group/getGroups`, 
          {withCredentials: true}
        );
        setAllGroups(response.data.groupDetails);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (allGroups.length === 0) {
      getGroups();
    } else {
      setLoading(false);
    }

  }, [setAllGroups, allGroups.length]); 

  return [allGroups, loading];
}
export default useGetAllGroups