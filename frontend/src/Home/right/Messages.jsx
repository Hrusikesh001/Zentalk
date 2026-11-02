import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/hello.json';
import useGetMessage from '../../context/useGetMessage.js';
import Loading from '../../components/Loading.jsx'
import Message from './Message.jsx';
import useConversation from '../../stateManage/useConversation.js';
import landingAnimationData from '../../assets/landing.json'
import useGetSocketMessage from '../../context/useGetSocketMessage.jsx'
import useGetGroupMessages from '../../context/useGetGroupMessages.js';
import useGetSocketGroupMessage from '../../context/useGetSocketGroupMessage.jsx';

function Messages({ className }) {
  const [selectedMessage, setSelectedMessage] = useState([]);
  const { messages, loading } = useGetMessage();
  const messagesLength = Array.isArray(selectedMessage) ? selectedMessage.length : 0;
  const { selectedConversation } = useConversation();
  const { groupMessages } = useGetGroupMessages();

  useGetSocketMessage();
  useGetSocketGroupMessage();
  
  const lastMessageRef = useRef();

  useEffect(() => {
    if (messagesLength > 0) {
      requestAnimationFrame(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [messagesLength]);

  useEffect(() => {
    if (!selectedConversation) {
      setSelectedMessage([]);
    } else if (selectedConversation.groupName) {
      setSelectedMessage(groupMessages);
    } else {
      setSelectedMessage(messages);
    }
  }, [selectedConversation, groupMessages, messages]);

  if (!selectedConversation) {
    return (
      <div className='flex items-center justify-center bg-gray-900 h-full'>
        <div style={{ width: 350, height: 350 }}>
          <Lottie
            animationData={landingAnimationData}
            loop
            autoplay
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-y-auto ${className}`}>
      {loading ? (
        <Loading />
      ) : (
        <div className="px-4 pb-2">
          {messagesLength > 0 ? (
            selectedMessage.map((message, index) => {
              if (!message || !message._id) return null;

              const isLast = index === selectedMessage.length - 1;
              return (
                <div key={message._id} ref={isLast ? lastMessageRef : null}>
                  <Message message={message} />
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">
              <div style={{ width: 250, height: 250 }}>
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Messages;