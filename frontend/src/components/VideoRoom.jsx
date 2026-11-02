import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoCallUI from './TwoPersonVideoPlayer';
import { useSocketContext } from '../context/socketContext';
import useConversation from '../stateManage/useConversation';
import GroupVideoCallUI from './GroupVideoCall';
import { useNavigate } from 'react-router-dom';

function VideoRoom({ uid, token, roomId, appId }) {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const client = useRef(null);
  const { socket } = useSocketContext();
  const { typeOfCall } = useConversation();
  const navigate = useNavigate();
  
  const handleUserJoined = async (user, mediaType) => {
    await client.current.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers(previousUsers => {
        // Update existing user or add new user
        const userExists = previousUsers.some(u => u.uid === user.uid);
        if (userExists) {
          return previousUsers.map(u => 
            u.uid === user.uid ? { ...u, videoTrack: user.videoTrack } : u
          );
        }
        return [...previousUsers, user];
      });
    }

    if (mediaType === 'audio') {
      setUsers(previousUsers => {
        const userExists = previousUsers.some(u => u.uid === user.uid);
        if (userExists) {
          return previousUsers.map(u => 
            u.uid === user.uid ? { ...u, audioTrack: user.audioTrack } : u
          );
        }
        return [...previousUsers, user];
      });
      user.audioTrack?.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers(previousUsers => 
      previousUsers.filter(u => u.uid !== user.uid)
    );
  };

  const leaveCall = () => {
    localTracks.forEach(track => {
      track?.stop();
      track?.close();
    });

    if (client.current) {
      client.current.unpublish(localTracks).finally(() => {
        client.current.leave();
      });
    }
    setUsers([]);
  };

  useEffect(() => {
    const handleCallEnded = () => {
      leaveCall();
      navigate('/');
    };

    const handleCallRejected = () => {
      leaveCall();
      navigate('/');
    };

    socket.on('call-ended', handleCallEnded);
    socket.on('call-rejected', handleCallRejected);

    return () => {
      socket.off('call-ended', handleCallEnded);
      socket.off('call-rejected', handleCallRejected);
    };
  }, [socket]);

  const handleEndCall = () => {
    if (typeOfCall === 'personalCall') {
      socket.emit('call-ended');
    }
    leaveCall();
    navigate('/');
  };

  useEffect(() => {
    const init = async () => {
      try {
        socket.emit('join-room', roomId);

        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        client.current = agoraClient;

        agoraClient.on('user-published', handleUserJoined);
        agoraClient.on('user-left', handleUserLeft);
        agoraClient.on('user-unpublished', (user, mediaType) => {
          if (mediaType === 'video') {
            setUsers(previousUsers => 
              previousUsers.map(u => 
                u.uid === user.uid ? { ...u, videoTrack: null } : u
              )
            );
          }
        });

        await agoraClient.join(appId, roomId, token, uid);
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

        setLocalTracks([audioTrack, videoTrack]);
        setUsers(previousUsers => [
          ...previousUsers.filter(u => u.uid !== uid),
          { uid, videoTrack, audioTrack, connected: true }
        ]);

        await agoraClient.publish([audioTrack, videoTrack]);
      } catch (error) {
        console.error('Error initializing video call:', error);
      }
    };

    init();

    return () => {
      localTracks.forEach(track => {
        track?.stop();
        track?.close();
      });

      if (client.current) {
        client.current.off('user-published', handleUserJoined);
        client.current.off('user-left', handleUserLeft);
        client.current.off('user-unpublished');
        client.current.unpublish(localTracks).finally(() => {
          client.current.leave();
        });
      }
    };
  }, [appId, token, roomId, uid]);

  return (
    <div>
      {localTracks.length > 0 && typeOfCall === 'personalCall' ? (
        <VideoCallUI
          users={users}
          localUser={{ uid, videoTrack: localTracks[1], audioTrack: localTracks[0] }}
          onMute={(muted) => {
            if (localTracks[0]) localTracks[0].setEnabled(!muted);
          }}
          onVideoToggle={(off) => {
            if (localTracks[1]) localTracks[1].setEnabled(!off);
          }}
          onEndCall={handleEndCall}
        />
      ) : (
        localTracks.length > 0 && (
          <GroupVideoCallUI
            users={users.filter(user => user.connected !== false)}
            localUser={{ uid, videoTrack: localTracks[1], audioTrack: localTracks[0] }}
            onMute={(muted) => {
              if (localTracks[0]) localTracks[0].setEnabled(!muted);
            }}
            onVideoToggle={(off) => {
              if (localTracks[1]) localTracks[1].setEnabled(!off);
            }}
            onEndCall={handleEndCall}
          />
        )
      )}
    </div>
  );
}

export default VideoRoom;