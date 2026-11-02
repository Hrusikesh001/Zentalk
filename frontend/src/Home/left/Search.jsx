import { useState } from 'react'
import userGetAllUsers from '../../context/userGetAllUsers.jsx'

function Search({ onSearch }) {

  const [search, setSearch] = useState("");
  const [allUsers] = userGetAllUsers(); 

  const onChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filteredUsers = allUsers.filter(user =>
      user.username.toLowerCase().startsWith(value.toLowerCase())
    );
    onSearch(filteredUsers, value);  
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const filteredUsers = allUsers.filter(user =>
      user.username.toLowerCase().startsWith(search.toLowerCase())
    );
    onSearch(filteredUsers, search); 
  };

  return (
    <div>
      <div className='px-10 py-4'>
        <form onSubmit={onSubmit}>
          <label className="input input-bordered flex items-center gap-2 focus-within:outline-none w-[100%] bg-slate-900">
            <input
              type="text"
              className="grow focus:ring-0 focus:border-transparent bg-slate-900"
              placeholder="Search"
              value={search}
              onChange={onChange}
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 hover:cursor-pointer">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd" />
              </svg>
            </button>
          </label>
        </form>
      </div>
    </div>
  )
}

export default Search