import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function VideoCallUI({ users, localUser, onMute, onVideoToggle, onEndCall }) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });

  // Find local and remote users
  const localUserObj = users.find(user => user.uid === localUser.uid);
  const remoteUsers = users.filter(user => user.uid !== localUser.uid);
  const primaryRemoteUser = remoteUsers[0]; 

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

  const handleMouseDown = (e) => {
    const elem = e.target.getBoundingClientRect();
    setDragging(true);
    setRel({ x: e.clientX - elem.left, y: e.clientY - elem.top });
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const videoArea = document.getElementById('video-area');
    if (videoArea) {
      const bounds = videoArea.getBoundingClientRect();
      const newX = e.clientX - rel.x;
      const newY = e.clientY - rel.y;
      const maxX = bounds.width - 192;
      const maxY = bounds.height - 128;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      bgcolor: 'black', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Video Area - 85% height */}
      <Box
        id="video-area"
        sx={{ 
          position: 'relative', 
          height: '90%',
          backgroundColor: '#121212'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Main Video (Remote User) */}
        <Box sx={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {primaryRemoteUser ? (
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video 
                ref={(node) => {
                  if (node && primaryRemoteUser.videoTrack) {
                    primaryRemoteUser.videoTrack.play(node, {
                      fit: 'contain'
                    });
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
                autoPlay 
              />
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}>
              <Avatar sx={{ 
                width: 120, 
                height: 120,
                bgcolor: 'primary.main',
                mb: 2
              }}>
                <Typography variant="h3">WD</Typography>
              </Avatar>
              <Typography variant="h6">Waiting for participant</Typography>
            </Box>
          )}
        </Box>

        {/* Small Draggable Video (Local User) */}
        {localUserObj && (
          <Paper
            elevation={6}
            sx={{
              width: 192,
              height: 128,
              position: 'absolute',
              top: position.y,
              left: position.x,
              cursor: 'move',
              borderRadius: 2,
              overflow: 'hidden',
              border: '2px solid white',
              zIndex: 10,
              backgroundColor: '#000'
            }}
            onMouseDown={handleMouseDown}
          >
            {videoOff ? (
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white'
              }}>
                <Typography variant="caption">You</Typography>
              </Box>
            ) : (
              <video 
                ref={(node) => {
                  if (node && localUserObj.videoTrack) {
                    localUserObj.videoTrack.play(node, {
                      fit: 'contain'
                    });
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                autoPlay 
                muted={true}
              />
            )}
          </Paper>
        )}
      </Box>

      {/* Controls Area - 15% height */}
      <Box
        sx={{
          width: '100%',
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
          variant={muted ? "contained" : "outlined"}
          color={muted ? "error" : "primary"}
          startIcon={muted ? <MicOffIcon /> : <MicIcon />}
          sx={{
            color: muted ? 'white' : 'primary.main',
            minWidth: '120px'
          }}
        >
          {muted ? 'Unmute' : 'Mute'}
        </Button>
        
        <Button
          onClick={handleVideoToggle}
          variant={videoOff ? "contained" : "outlined"}
          color={videoOff ? "error" : "primary"}
          startIcon={videoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          sx={{
            color: videoOff ? 'white' : 'primary.main',
            minWidth: '120px'
          }}
        >
          {videoOff ? 'Camera Off' : 'Camera On'}
        </Button>
                
        <Button
          onClick={handleEndCall}
          variant="contained"
          color="error"
          startIcon={<CallEndIcon />}
          sx={{
            minWidth: '120px'
          }}
        >
          End Call
        </Button>
      </Box>
    </Box>
  );
}