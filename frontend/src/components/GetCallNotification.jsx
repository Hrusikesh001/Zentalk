import { useState, useEffect, useRef } from 'react';
import sound from '../assets/stay_with_me.mp3'
import './CallNotification.css';


export const CallNotification = ({ caller, onAccept, onReject, duration = 8000 }) => {
  const [visible, setVisible] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      stopAudio();
      onReject();
    }, duration);

    audioRef.current = new Audio(sound);
    audioRef.current.loop = true;
    audioRef.current.play();

    return () => {
      clearTimeout(timer);
      stopAudio();
    };
  }, [duration, onReject]);

  const stopAudio = () => {
    if(audioRef.current){
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const handleAccept = () => {
    setVisible(false);
    stopAudio();
    onAccept();
  };

  const handleReject = () => {
    setVisible(false);
    stopAudio();
    onReject();
  };

  if (!visible) return null;

  return (
    <div className="call-notification">
      <div className="caller-info">
        <div className="caller-name">{caller.name}</div>
        <div className="caller-status">Incoming call...</div>
      </div>
      <div className="call-buttons">
        <button className="accept-button" onClick={handleAccept}>
          Accept
        </button>
        <button className="reject-button" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};