import React from 'react'
import Left from './Home/left/Left.jsx'
import Right from './Home/right/Right.jsx'
import Logout from './Home/left1/Logout.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import { useAuth } from './context/AuthProvider.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import CreateGroup from './Home/Group/createGroup.jsx'
import CallSocketListener from './components/CallSocketListener.jsx'
import GlobalCallNotification from './components/GlobalCallNotification.jsx'
import { useCallContext } from './context/CallContext.jsx'
import VideoRoom from './components/VideoRoom.jsx'

function App() {
  const { authUser, setAuthUser } = useAuth();
  const { callConfig } = useCallContext();
  return (
    <>
      <CallSocketListener />
      <GlobalCallNotification />

      {console.log(callConfig)}

      <Routes>

        <Route path='/call' element={callConfig ? (
          <VideoRoom
            uid={callConfig.uid}
            token={callConfig.token}
            roomId={callConfig.roomId}
            appId={callConfig.appId}
          />
        ) : <Navigate to='/' />}></Route>

        <Route path='/' element={
          authUser ? <div className='flex h-screen'>
            <Logout></Logout>
            <Left></Left>
            <Right></Right>
          </div> : <Navigate to={'/login'} />
        }></Route>

        <Route path="/signup" element={authUser ? <Navigate to={"/"} /> : <Signup />}></Route>

        <Route path='/login' element={authUser ? <Navigate to={"/"} /> : <Login />}></Route>

        <Route
          path="/create-group"
          element={authUser ? <CreateGroup /> : <Navigate to="/login" />}
        />

      </Routes>
      <Toaster />

    </>
  )
}

export default App