import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Lottie from 'lottie-react';
import animationData from '../../assets/notFound.json';
import userGetAllUsers from '../../context/userGetAllUsers.jsx';
import useConversation from '../../stateManage/useConversation.js';
import axios from 'axios';
import GroupIcon from '@mui/icons-material/Group';
import server from '../../environment.js';

const LeftSidebar = ({getSelectedUsers}) => {
  const { selectedConversation, selectedUsersId, setSelectedUsersId } = useConversation();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [showSelected, setShowSelected] = useState([]);

  const onChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/user/getUsers`,
        { username: search },
        { withCredentials: true }
      );
      setUsers(data.users);
    } catch (err) {
      console.log(err);
    }
    setSearch("");
  };

  const handleCheckBoxChange = (userId, user) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });

    setShowSelected((prevSelected) => {
      const exists = prevSelected.some(u => u._id === user._id);
      if (exists) {
        return prevSelected.filter(u => u._id !== user._id);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  useEffect(() => {
    setSelectedUsersId(selectedUsers);
    getSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  return (
    <div className="w-[100%] h-[100%] border-r border-slate-700 flex flex-col">
      {/* Search bar */}
      <div className='flex justify-center px-4 py-3'>
        <form onSubmit={onSubmit}>
          <label className="input input-bordered flex items-center gap-2 focus-within:outline-none w-[15vw] bg-slate-900 border-slate-700">
            <input
              type="text"
              className="grow focus:ring-0 focus:border-transparent bg-slate-900 text-white placeholder-slate-500"
              placeholder="Search"
              value={search}
              onChange={onChange}
            />
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 hover:cursor-pointer hover:opacity-100"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </label>
        </form>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <Box
            key={user._id}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #334155',
              marginBottom: 1,
              '&:hover': {
                backgroundColor: '#1e293b',
              }
            }}
          >
            <div className="flex items-center">
              <Avatar
                alt={user.username}
                src={user.profilePicURL}
                sx={{ width: 50, height: 50 }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  ml: 2,
                  fontWeight: 'medium',
                  color: 'white'
                }}
              >
                {user.username}
              </Typography>
            </div>
            <Checkbox
              checked={selectedUsers.includes(user._id)}
              onChange={() => {
                handleCheckBoxChange(user._id, user);
              }}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 20,
                  color: 'white'
                },
                '&.Mui-checked': {
                  color: '#6366f1',
                }
              }}
            />
          </Box>
        ))}

        {showSelected.length > 0 && (
          <>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#1e293b',
                borderBottom: '1px solid #334155',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ marginRight: '8px' }}><GroupIcon/></span>
                Selected Users ({showSelected.length})
              </Typography>
            </Box>
            {showSelected.map((user) => (
              <Box
                key={user._id}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #334155',
                  marginBottom: 1,
                  '&:hover': {
                    backgroundColor: '#1e293b',
                  }
                }}
              >
                <div className="flex items-center">
                  <Avatar
                    alt={user.username}
                    src={user.profilePicURL}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      ml: 2,
                      fontWeight: 'medium',
                      color: 'white'
                    }}
                  >
                    {user.username}
                  </Typography>
                </div>
                <Checkbox
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => {
                    handleCheckBoxChange(user._id, user);
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                      color: 'white'
                    },
                    '&.Mui-checked': {
                      color: '#6366f1',
                    }
                  }}
                />
              </Box>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;