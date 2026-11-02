import { useForm } from "react-hook-form";
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import toast from "react-hot-toast";
import Lottie from 'lottie-react';
import animationData from '../assets/loading.json'
import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { transformImage } from "../lib/features";
import server from "../environment.js";


function Edit() {

  const { authUser, setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: authUser?.user?.name || "",
      username: authUser?.user?.username || ""
    }
  })

  React.useEffect(() => {
    if (authUser?.user) {
      setValue('name', authUser.user.name);
      setValue('username', authUser.user.username);
    }
  }, [authUser, setValue]);

  if (shouldRedirect) {
    return <Navigate to="/login"/>
  }

  const password = watch('password', "");
  const confirmpassword = watch('confirmpassword', "");
  const validatePasswordMatch = (value) => {
    return value === password || "Password doesn't match Confirm Password"
  }

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const file = data.profilePic[0];
      let imageURL = "";
      console.log(authUser);
      if (file) {
        try {
          const { data: cloudData } = await axios.get(
            `${server}/getImage`,
            { withCredentials: true }
          );

          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', cloudData.apiKey);
          formData.append('timestamp', cloudData.timestamp);
          formData.append('signature', cloudData.signature);

          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudData.cloudName}/image/upload`;

          const uploadRes = await axios.post(cloudinaryUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          imageURL = uploadRes.data.secure_url;
        } catch (err) {
          console.error("Cloudinary upload error:", err);
          throw err; 
        }
      }

      const userInfo = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
        profilePicURL: imageURL || authUser.user.profilePicURL,
      };

      const response = await axios.post(
        `${server}/user/edit`,
        userInfo,
        { withCredentials: true }
      );

      localStorage.setItem("messenger", JSON.stringify(response.data));
      setAuthUser(response.data);
      toast.success("Profile updated successfully");
      console.log(authUser);
      setShouldRedirect(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md shadow-xl bg-base-100">
          <div className="card-body p-0">
            <div className='flex flex-col items-center justify-center p-8 gap-4'>
              <div className="w-50 h-45">
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
              <span className="text-lg font-medium">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-3xl shadow-xl bg-base-100"> {/* Increased max width */}
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Edit User Details</h2>
          <div className="flex flex-col md:flex-row gap-8 mt-6">

            <div className="w-full md:w-1/3 flex flex-col items-center mt-20">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 overflow-hidden">
                {watch('profilePic')?.length > 0 ? (
                  <img
                    src={URL.createObjectURL(watch('profilePic')[0])}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={transformImage(authUser.user.profilePicURL, 400, 300)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <label className="cursor-pointer">
                <span className="btn btn-sm btn-outline">Upload Profile Picture</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("profilePic")}
                />
              </label>
            </div>

            <div className="w-full md:w-2/3">
              <form className="form-control space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  id="login-name"
                  label="Name"
                  variant="outlined"
                  className="w-full"
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
                  {...register("name", { required: true })}
                />
                {errors.name && <span className='text-red-600'>This field is required</span>}

                <TextField
                  id="login-username"
                  label="Username"
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
                  {...register("username", { required: true })}
                />
                {errors.username && <span className='text-red-600'>This field is required</span>}

                <TextField
                  id="login-email"
                  label="Email"
                  variant="outlined"
                  className="w-full mt-4"
                  value={authUser?.user?.email || ""}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: '#9ca3af',
                        opacity: 1,
                      },
                    },
                    '& .MuiInputLabel-root': {
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
                  InputProps={{
                    readOnly: true,
                  }}
                  {...register("email", {
                    required: true,
                  })}
                />
                {errors.email && <span className='text-red-600'>This field is required</span>}

                <TextField
                  id="login-password"
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
                  id="login-confirmpassword"
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
                {errors.confirmpassword && <span className='text-red-600'>{errors.confirmpassword.message}</span>}

                <div className="mt-8">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Edit Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;