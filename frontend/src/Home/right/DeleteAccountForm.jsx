import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from "react-hook-form"
import TextField from '@mui/material/TextField';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';
import server from '../../environment.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  minWidth: '300px',
  maxWidth: '500px',
  height: '50vh',
  bgcolor: '#111827',
  borderRadius: '8px',
  border: '1px solid #1f2937',
  boxShadow: 24,
  p: 0,
  display: 'flex',
  flexDirection: 'column',
};

export default function DeleteForm({ open, onClose }) {

  const {authUser, setAuthUser} = useAuth();
  const [redirLogin, setRedirLogin] = React.useState(false);

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

  if (redirLogin) {
    return <Navigate to="/login" />
  }

  const onFormSubmit = async (values) => {
    console.log(values);
    try {

      const { email, password } = values;

      const { data } = await axios.post(
        `${server}/user/confirmDeleteAccount`,
        { email, password },
        { withCredentials: true }
      );

      if (data.userDelete) {
        try {
          console.log('I am working');
          const userInfo = {
            name: authUser?.user?.name,
            username: authUser?.user?.username,
            email: authUser?.user?.email,
            profilePicURL: authUser?.user?.profilePicURL,
          }

          const deletUser = await axios.post(
            `${server}/user/delete`,
            userInfo,
            { withCredentials: true }
          )
            .then((response) => {
              if (response.data) {
                toast.success(response.data.message);
              }
              localStorage.removeItem("messenger");
              setAuthUser(undefined);
              setRedirLogin(true);
            })
            .catch((e) => {
              toast.error("Some error occured!");
              console.log("Error in handleDeleteClick : ", e);
              setRedirLogin(false);
            });
        } catch (err) {
          console.log(err);
          toast.error("Some error occured!");
          setRedirLogin(false);
        }
      }

    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="card w-full h-full shadow-xl ">
            <div className="card-body overflow-y-auto">
              <h2 className="text-2xl font-bold text-center">Confirm Delete Account</h2>
              <form className="form-control space-y-4 mt-4 w-full" onSubmit={handleSubmit(onFormSubmit)}>
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
                {errors.confirmpassword && <span className='text-red-600'>{errors.confirmpassword.message}</span>}

                <div className='w-[100%] flex justify-center'>
                  <div className="mt-8">
                    <button
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      type='submit'
                    >
                      <DeleteIcon fontSize="small" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}