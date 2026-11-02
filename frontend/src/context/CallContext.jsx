import { createContext, useState, useContext } from "react";

const CallContext = createContext();

export const CallProvider = ({children}) => {
  const [callData, setCallData] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [callConfig, setCallConfig] = useState(null);

  const answerCall = (data) => {
    setCallConfig(data);
    setShowNotification(false);
  }

  const endCall = () => {
    setCallConfig(null);
    setShowNotification(false);
  }

  return(
    <CallContext.Provider value={{ 
      callData, 
      setCallData, 
      showNotification, 
      setShowNotification,
      callConfig,
      answerCall, 
      endCall, 
    }}>
      {children}
    </CallContext.Provider>
  );

}

export const useCallContext = () => useContext(CallContext);

























