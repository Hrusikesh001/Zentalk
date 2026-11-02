import React, { useEffect, useState } from 'react';
import User from './User';
import userGetAllUsers from '../../context/userGetAllUsers.jsx';
import useGetAllGroups from '../../context/useGetAllGroups.js';
import Lottie from 'lottie-react';
import animationData from '../../assets/notFound.json';
import useConversation from '../../stateManage/useConversation.js';

function Users({ searchResults, searchQuery }) {
  const [allUsers] = userGetAllUsers();
  const [allGroups] = useGetAllGroups();
  const {allFriends, setAllFriends} = useConversation();

  useEffect(() => {
    setAllFriends(allUsers);
  }, [allUsers]);

  if (searchResults.length === 0 && searchQuery) {
    return (
      <div className='flex items-center justify-center'>
        <div style={{ width: 300, height: 300 }}>
          <Lottie animationData={animationData} loop autoplay />
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-y-auto h-[85vh]'>
      {searchResults.length > 0
        ? searchResults.map((user, index) => (
          <User key={index} user={user} isUser={true} />
        ))
        : allFriends?.map((user, index) => (
          <User key={index} user={user} isUser={true} />
        ))
      }
      {allGroups.map((group, index) => (
        <User key={index} user={group} isUser={false} />
      ))}
    </div>
  );
}

export default Users;