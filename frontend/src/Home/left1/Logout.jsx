import React from 'react'
import { BiLogOut } from "react-icons/bi";
import {useState} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import server from '../../environment.js';


export default function Right() {

  const [loading, setLoading] = useState(false);
  const {authUser, setAuthUser} = useAuth();

  const handleLoguout = async () => {
    setLoading(true);
    try{
      const res = await axios.post(`${server}/user/logout`,{}, { withCredentials: true });
      localStorage.removeItem("messenger");
      setAuthUser(undefined);
      setLoading(false);
      toast.success("Logged Out!");
    }catch(err){
      console.log(err);
      setLoading(false);
      toast.error("Fail to Logout!");
    }
  }
  return (
    <div className='w-[4%] bg-slate-950 text-white flex flex-col justify-end text-center '>
      <div className='font-bold text-5xl px-1 py-2'>
        <button onClick={handleLoguout}>
          <BiLogOut className='hover:cursor-pointer p-2 hover:bg-gray-600 rounded-lg hover: duration-300'/>
        </button>
      </div>
    </div>
  )
}
