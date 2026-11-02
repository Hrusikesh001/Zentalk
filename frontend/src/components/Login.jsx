import React from 'react';
import { useForm } from "react-hook-form"
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import server from '../environment.js';

function Login() {

  const {authUser, setAuthUser} = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ 
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })


  const password = watch('password', "");
  const confirmpassword = watch('confirmpassword', "");
  const validatePasswordMatch = (value) => {
    return value === password || "Password doesn't match Confirm Password"
  }

  const onSubmit = async (data) => {
    const userInfo = {
      email : data.email,
      password : data.password, 
      confirmpassword : data.confirmpassword,
    };

    await axios.post(`${server}/user/login`, userInfo, {
      withCredentials : true,
    })
      .then((response) => {
        if(response.data){
          console.log(response.data);
          toast.success("User Logged In Successful!");
        }
        localStorage.setItem("messenger", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((e) => {
        if(e.response){
          toast.error("Error: " + e.response.data.message);
        } else {
          toast.error("An unknown error occurred.");
        }
      });
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">LogIn</h2>
          <form className="form-control space-y-4 mt-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              className="w-full mt-4"
              sx={{
                input: {
                  color: 'white',            
                  '::placeholder': {
                    color: '#9ca3af',          
                    opacity: 1,              
                  },
                },
                label: {
                  color: '#9ca3af',            
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#9ca3af',    
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',     
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9ca3af', 
                  },
                },
              }}
              {...register("email", { required: true })}
            />
            {errors.email && <span className='text-red-600'>This field is required</span>}

            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type='password'
              className="w-full mt-4"
              sx={{
                input: {
                  color: 'white',            
                  '::placeholder': {
                    color: '#9ca3af',          
                    opacity: 1,              
                  },
                },
                label: {
                  color: '#9ca3af',            
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#9ca3af',    
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',     
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9ca3af', 
                  },
                },
              }}
              {...register("password", { required: true })}
            />
            {errors.password && <span className='text-red-600'>This field is required</span>}
            
            <TextField
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              type='password'
              className="w-full mt-4"
              sx={{
                input: {
                  color: 'white',            
                  '::placeholder': {
                    color: '#9ca3af',          
                    opacity: 1,              
                  },
                },
                label: {
                  color: '#9ca3af',            
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#9ca3af',    
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',     
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9ca3af', 
                  },
                },
              }}
              {...register("confirmpassword", { required: true, validate: validatePasswordMatch })}
            />
            {errors.confirmpassword && <span  className='text-red-600'>{errors.confirmpassword.message}</span>}

            <div className="mt-8">
              <button
                type="submit"
                className="btn btn-primary"
              >
                LogIn
              </button>
            </div>
          </form>
          <div className='mt-2'>
            <p>
              Don't have any account?
              <Link to={"/signup"} className='text-blue-500 hover:cursor-pointer ml-2 underline'>
                {" "}SignUp
              </Link>
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
