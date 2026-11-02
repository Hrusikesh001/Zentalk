import { useState } from 'react';
import RightContent from './RightContent';
import LeftSidebar from './leftContent.jsx';
import SearchTop from '../left/SearchTop.jsx';
import userGetAllUsers from '../../context/userGetAllUsers.jsx';

const ChatInterface = () => {

  const [allUsers] = userGetAllUsers();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  return (
    <div className="flex h-screen text-white" style={{ backgroundColor: '#111827' }}>
      <div className='w-1/5 bg-black'>
        <div className='h-1/7'>
          <SearchTop />
        </div>
        <div className='h-6/7'>
          <LeftSidebar
            getSelectedUsers={() => {
              
            }}
          />
        </div>
      </div>
      <RightContent />
    </div>
  );
};

export default ChatInterface;