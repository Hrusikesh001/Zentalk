import React, { useState, useEffect, useRef } from 'react';
import { IoIosSend } from "react-icons/io";
import useConversation from "../../stateManage/useConversation.js";
import useSendMessage from '../../context/useSendMessage.js';
import useSendGroupMessage from '../../context/useSendGroupMessage.js';
import AttachmentSharpIcon from '@mui/icons-material/AttachmentSharp';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileUploadModal from './FileUpload.jsx';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import EmojiPicker from 'emoji-picker-react';
import { autocompleteClasses } from '@mui/material';

function Type() {
  const { selectedConversation } = useConversation();
  const { loading, sendMessage } = useSendMessage();
  const { loadingGroup, sendGroupMessage } = useSendGroupMessage();
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const attachmentsRef = useRef(null);
  const buttonRef = useRef(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [showEmojies, setShowEmojies] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!selectedConversation) return;

    if (selectedConversation.groupName) {
      await sendGroupMessage(message);
    } else {
      await sendMessage(message);
    }
    setMessage("");
  };

  const handleSendFile = async (file, description) => {
    if (!selectedConversation) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', description || '');

    if (selectedConversation.groupName) {
      await sendGroupMessage(formData, true);
    } else {
      await sendMessage(formData, true);
    }
  };

  const toggleAttachments = (e) => {
    e.stopPropagation();
    setShowAttachments(!showAttachments);
  };

  const openFileModal = () => {
    setShowAttachments(false);
    setFileModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAttachments &&
        attachmentsRef.current &&
        !attachmentsRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)) {
        setShowAttachments(false);
      }
    };

    if (showAttachments) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachments]);

  const handleEmojiClick = () => {
    if (showEmojies) {
      setShowEmojies(false);
    } else {
      setShowEmojies(true);
    }
  }

  if (!selectedConversation) return null;

  return (
    <div className="relative bg-gray-900 p-4">
      <form onSubmit={handleSubmit}>
        {
          showEmojies &&
          (<div style={{
            zIndex: 10,
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: '10px',
            width: 'clamp(250px, 90vw, 400px)'
          }}>
            <EmojiPicker
              width="25vw"
              height={400}
              theme="dark"
              previewConfig={{ showPreview: false }}
              style={{
                '--epr-bg-color': '#1f2937',
                '--epr-category-label-bg-color': '#111827',
                '--epr-search-input-bg-color': '#374151',
                '--epr-search-border-color': '#4b5563',
                '--epr-picker-border-color': '#1f2937',
                '--epr-emoji-size': '1.5rem',
                '--epr-emoji-gap': '0.3rem',
              }}
              onEmojiClick={(e) => {
                setMessage(prev => prev + (e.native || e.emoji || e.character));
              }}

            />
          </div>)
        }
        <div className="flex items-center w-full max-w-2xl mx-auto gap-3">
          <button
            className="text-gray-400 hover:text-white  rounded-full"
            onClick={handleEmojiClick}
            type='button'
          >
            <EmojiEmotionsOutlinedIcon className="text-xl" />
          </button>
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-full py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                ref={buttonRef}
                type="button"
                onClick={toggleAttachments}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <AttachmentSharpIcon className="text-xl" sx={{ rotate: "-30deg" }} />
              </button>

              {showAttachments && (
                <div
                  ref={attachmentsRef}
                  className="absolute bottom-full left-0 bg-gray-800 rounded-lg shadow-lg w-48 z-10 mb-1"
                >
                  <div className="flex flex-col text-white p-1">
                    <button
                      type="button"
                      className="flex items-center p-3 hover:bg-gray-600 rounded-t-lg cursor-pointer gap-3"
                      onClick={openFileModal}
                    >
                      <span className="text-xl"><ImageOutlinedIcon /></span>
                      <span>Image</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center p-3 hover:bg-gray-600 cursor-pointer gap-3"
                      onClick={openFileModal}
                    >
                      <span className="text-xl"><MicOutlinedIcon /></span>
                      <span>Audio</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center p-3 hover:bg-gray-600 cursor-pointer gap-3"
                      onClick={openFileModal}
                    >
                      <span className="text-xl"><SlideshowOutlinedIcon /></span>
                      <span>Video</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center p-3 hover:bg-gray-600 rounded-b-lg cursor-pointer gap-3"
                      onClick={openFileModal}
                    >
                      <span className="text-xl"><InsertDriveFileOutlinedIcon /></span>
                      <span>File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IoIosSend className="text-xl" />
          </button>
        </div>
      </form>

      <FileUploadModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        onSend={handleSendFile}
      />
    </div>
  );
}

export default Type;