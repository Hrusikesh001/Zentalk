import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function GroupVideoCallUI({ users, localUser, onMute, onVideoToggle, onEndCall }) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const localUserObj = users.find(user => user.uid === localUser.uid);
  const remoteUsers = users.filter(user => user.uid !== localUser.uid);

  const handleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (onMute) onMute(newMuted);
  };

  const handleVideoToggle = () => {
    const newVideoOff = !videoOff;
    setVideoOff(newVideoOff);
    if (onVideoToggle) onVideoToggle(newVideoOff);
  };

  const handleEndCall = () => {
    if (onEndCall) onEndCall();
  };

  // Create video boxes with local user first, then remote users
  const allUsers = [localUserObj, ...remoteUsers];

  // Group users into pages with max 4 per page
  const groupUsers = (users, usersPerPage = 4) => {
    const grouped = [];
    for (let i = 0; i < users.length; i += usersPerPage) {
      grouped.push(users.slice(i, i + usersPerPage));
    }
    return grouped;
  };

  const groupedUsers = groupUsers(allUsers);

  const renderVideoBox = (user, isLocal = false) => {
    const showVideo = user?.videoTrack && !(isLocal && videoOff);
    
    return (
      <Box
        key={user?.uid || 'local'}
        sx={{
          flex: '1 1 45%',
          aspectRatio: '16/9',
          minWidth: 0,
          minHeight: 0,
          border: '1px solid #333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#000',
        }}
      >
        {showVideo ? (
          <video
            ref={(node) => {
              if (node && user.videoTrack) {
                user.videoTrack.play(node, { fit: 'cover' });
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            autoPlay
            muted={isLocal}
          />
        ) : (
          <Box
            sx={{
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 1 }}>
              <Typography variant="h6">{isLocal ? 'You' : (user ? 'US' : '')}</Typography>
            </Avatar>
            <Typography>{isLocal ? 'You' : (user ? `User ${user.uid}` : '')}</Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'black', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {groupedUsers.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            style={{
              '--swiper-navigation-color': '#fff',
              '--swiper-navigation-size': '30px',
              padding: '0 40px',
              height: '100%',
            }}
          >
            {groupedUsers.map((group, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: 2,
                    p: 2,
                  }}
                >
                  {group.map((user) =>
                    renderVideoBox(user, user?.uid === localUser.uid)
                  )}
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: 'white'
          }}>
            <Typography>No participants</Typography>
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          height: '10%',
          p: 2,
          bgcolor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          onClick={handleMute}
          variant={muted ? 'contained' : 'outlined'}
          color={muted ? 'error' : 'primary'}
          startIcon={muted ? <MicOffIcon /> : <MicIcon />}
          sx={{ minWidth: 120 }}
        >
          {muted ? 'Unmute' : 'Mute'}
        </Button>

        <Button
          onClick={handleVideoToggle}
          variant={videoOff ? 'contained' : 'outlined'}
          color={videoOff ? 'error' : 'primary'}
          startIcon={videoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          sx={{ minWidth: 120 }}
        >
          {videoOff ? 'Camera Off' : 'Camera On'}
        </Button>

        <Button
          onClick={handleEndCall}
          variant="contained"
          color="error"
          startIcon={<CallEndIcon />}
          sx={{ minWidth: 120 }}
        >
          End Call
        </Button>
      </Box>
    </Box>
  );
}