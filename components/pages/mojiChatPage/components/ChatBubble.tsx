import React from 'react';
import { Message, Sender } from '../chatTypes';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[85%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Avatar / Name Label */}
        <div className={`flex items-center gap-2 mb-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] ${isUser ? 'bg-[#ffc8dd]' : 'bg-[#a2d2ff]'}`}>
            {isUser ? '🐰' : '👾'}
          </div>
          <span className="text-xs font-bold text-gray-500 tracking-wider">
            {isUser ? 'YOU' : 'MOJI'}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={`
            relative px-6 py-4 text-xl border-2 border-gray-800
            text-gray-900 font-medium
            transform transition-transform duration-200 hover:-translate-y-1
            ${isUser
              ? 'bg-[#ffe5ec] rounded-3xl rounded-tr-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-[#e0fbfc] rounded-3xl rounded-tl-none shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)]'
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed tracking-wide">
            {message.text}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 mt-2 px-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};