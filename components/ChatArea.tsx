import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import { Button } from './Button';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping 
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-darkBg relative">
      {/* Channel Header */}
      <div className="h-16 px-6 border-b border-slate-700 flex items-center justify-between bg-darkBg/95 backdrop-blur z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏡</span>
            <h2 className="text-lg font-bold text-white">Neighborhood Chat</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">The pulse of the local community.</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <div className="text-6xl mb-4">👋</div>
            <p>Welcome to the neighborhood!</p>
            <p>Introduce yourself and meet your neighbors.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}
          >
            {/* Avatar */}
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-lg overflow-hidden
                ${msg.isUser ? 'bg-primary text-white' : 'bg-slate-700'}
              `}
              style={(!msg.isUser && msg.avatarColor) || (msg.isUser && !msg.avatarImage) ? { backgroundColor: msg.avatarColor } : {}}
            >
              {msg.isUser && msg.avatarImage ? (
                <img src={msg.avatarImage} alt="Me" className="w-full h-full object-cover" />
              ) : msg.isUser ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                msg.avatarColor ? msg.avatarColor /* Actually stores emoji for AI */ : '🤖'
              )}
            </div>

            {/* Content */}
            <div className={`flex flex-col max-w-[80%] md:max-w-[60%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-bold text-slate-200">{msg.senderName}</span>
                <span className="text-xs text-slate-500">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div 
                className={`
                  px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md
                  ${msg.isUser 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-darkSurface text-slate-200 rounded-tl-none border border-slate-700'}
                `}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
              ...
            </div>
            <div className="bg-darkSurface border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-darkBg border-t border-slate-700">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex gap-2 items-end"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message the neighborhood..."
              className="w-full bg-darkSurface border border-slate-600 text-slate-100 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none placeholder-slate-500 transition-all shadow-inner"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!inputText.trim()}
            className="h-[50px] w-[50px] !p-0 rounded-xl shrink-0"
          >
            <svg className="w-5 h-5 transform rotate-90 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-500">AI-generated content. May produce inaccurate information.</p>
        </div>
      </div>
    </div>
  );
};