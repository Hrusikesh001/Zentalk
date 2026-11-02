import React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import RenderAttachment from './RenderAttachment';
import { fileFormat } from '../../lib/features';



function Message({ message }) {
  const authUser = JSON.parse(localStorage.getItem("messenger"));
  const itsMe = message.sender._id === authUser.user._id;
  const chatSide = itsMe ? "chat-end" : "chat-start";
  const chatColor = itsMe ? "chat-bubble-success" : "chat-bubble-info";

  let url = "";
  let file = "";

  return (
    <div>
      {
        message.message?.trim() &&

        (<div>
          <div className={`chat ${chatSide} mt-4`}>
            <div className="chat-header">
              {message.sender.name}
            </div>
            <div className={`chat-bubble ${chatColor} max-w-[10rem] md:max-w-[20rem] lg:max-w-[30rem] break-words`}>
              {message.message}
            </div>
            <div className="chat-footer opacity-70 text-xs">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>)
      }

      {
        message.attachment?.length > 0 && (
          url = `${message.attachment[0].attachmentUrl}`,
          file = fileFormat(url),
          <div>
            <div className={`chat ${chatSide} mt-4 flex flex-col`}>

              <div className="chat-header">
                {message.sender.name}
              </div>

              <div className="max-w-xs md:max-w-md">
                <div className="p-1 bg-gray-800 rounded-lg inline-block border border-gray-900 text-center">
                  <a
                    href={`${message.attachment[0].attachmentUrl}`}
                    target='_blank'
                    download
                    className="block overflow-hidden rounded-md"
                  >
                    {RenderAttachment(file, url)}
                  </a>
                  <textarea
                    className="w-full bg-transparent border-none resize-none focus:outline-none placeholder-gray-400"
                    value={message.attachment[0].attachmentMessage}
                    readOnly
                  />
                  <p className="w-full bg-transparent border-none resize-none focus:outline-none placeholder-gray-400"></p>
                </div>
              </div>

              <div className="chat-footer opacity-70 text-xs">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

        )
      }
    </div>
  )
}

export default Message;