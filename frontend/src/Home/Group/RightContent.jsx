import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import avatar from '../../assets/images/groupImage.png';
import useConversation from '../../stateManage/useConversation.js';
import axios, { all } from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';
import server from '../../environment.js';


const RightContent = () => {
  const { selectedUsersId, setSelectedUsersId, allGroups, setAllGroups } = useConversation();
  const { authUser, setAuthUser } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmitForm = async (data) => {

    console.log("Clicked");

    const file = data.profilePic[0];

    let imageURL = "";

    if (selectedUsersId.length < 2) {
      return toast.error("Select atleast 2 group members!");
    }

    if (file) {
      try {
        const { data } = await axios.get(
          `${server}/getImage`,
          { withCredentials: true }
        );

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', data.apiKey);
        formData.append('timestamp', data.timestamp);
        formData.append('signature', data.signature);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;

        const uploadRes = await axios.post(cloudinaryUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageURL = uploadRes.data.secure_url;

        console.log(imageURL);

      } catch (err) {
        console.log(err);
      }
    }

    if (!imageURL || imageURL.trim() === "") {
      imageURL = `https://res.cloudinary.com/dafekrjjw/image/upload/v1747582003/bpa5qe4g63za0aupfctu.png`;
    }
    const group_ids = [
      ...selectedUsersId.filter(id => id !== authUser.user._id),
      authUser.user._id,
    ];
    setSelectedUsersId(group_ids);

    const groupData = {
      groupName: data.name,
      groupUsers: group_ids,
      groupProfileImage: imageURL,
    }

    const userInfo = {
      name: authUser.user.name,
      username: authUser.user.username,
      email: authUser.user.email,
      profilePicURL: authUser.user.profilePicURL,
    };

    axios.post(
      `${server}/group/createGroup`, 
      {
        groupData,
        userInfo
      },
      {withCredentials : true}
    )
    .then((response) => {
      toast.success("Group Created");
      allGroups.push(response.data.group);
      setAllGroups(allGroups);
      navigate('/');
    })
    .catch((err) => {
      console.log(err);
    });

  };



  return (
    <div className="w-4/5 flex justify-center">
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
              src={avatar}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <label className="cursor-pointer">
          <span className="btn btn-sm btn-outline">Upload Group Profile Picture</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            {...register("profilePic")}
          />
        </label>

        <form className="form-control space-y-4 w-full mt-8" onSubmit={handleSubmit(onSubmitForm)}>
          <TextField
            id="login-name"
            label="Group Name"
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
          <br />
          <button type="submit" className="btn btn-primary mt-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default RightContent;