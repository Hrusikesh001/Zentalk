import React, { useState } from 'react';
import Search from './Search';
import Users from './Users';
import SearchTop from './SearchTop';

export default function Left() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='w-[25%] bg-black text-white'>
      <div className='h-1/7'>
        <SearchTop />
        <Search
          onSearch={(results, query) => {
            setSearchResults(results);
            setSearchQuery(query);
          }}
        />
        
      </div>

      <div className='h-6/7'>
      <hr />
        <Users
          searchResults={searchResults}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}