import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import server from '../environment.js';

function userGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get(`${server}/user/getUserProfile`, {
          withCredentials: true,
          headers : {
            Authorization : `Bearer ${token}`
          },
        });

        setAllUsers(response.data.filteredUsers);
        setLoading(false);
      } catch (err) {
        console.log("Error in userGetAllUsers : " + err);
      }
    }
    getUsers();

  }, []);

  return [allUsers, loading];
}

export default userGetAllUsers;