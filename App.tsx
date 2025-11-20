import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ProfileEdit } from './components/ProfileEdit';
import { AppView, User, Message } from './types';
import { getCommunityResponse } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Restore session if available
  useEffect(() => {
    const savedUser = sessionStorage.getItem('current_session_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView(AppView.CHAT);
    }
  }, []);

  const handleAuthenticated = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('current_session_user', JSON.stringify(user));
    setView(AppView.CHAT);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    sessionStorage.setItem('current_session_user', JSON.stringify(updatedUser));
    
    // Also update the long-term storage if we were using it
    if (updatedUser.email) {
      localStorage.setItem(`user_${updatedUser.email}`, JSON.stringify(updatedUser));
    }
    
    setView(AppView.CHAT);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('current_session_user');
    setView(AppView.LOGIN);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.username,
      content: text,
      timestamp: Date.now(),
      isUser: true,
      avatarColor: currentUser.avatarColor,
      avatarImage: currentUser.avatarImage
    };

    // Update UI immediately
    setMessages(prev => [...prev, newMessage]);

    // Trigger AI Response
    setIsTyping(true);
    
    // Pass context to service
    const aiResponses = await getCommunityResponse(
      "Neighborhood",
      "The pulse of the local community.",
      [...messages, newMessage], // Include new message in context
      text
    );

    setIsTyping(false);

    // Add AI responses one by one with slight delay for realism
    if (aiResponses.length > 0) {
      let delay = 500;
      aiResponses.forEach((response, index) => {
        setTimeout(() => {
          const aiMsg: Message = {
            id: (Date.now() + index).toString(),
            senderId: 'ai',
            senderName: response.senderName,
            content: response.content,
            timestamp: Date.now(),
            isUser: false,
            avatarColor: response.emoji // Using emoji as avatar placeholder for AI
          };

          setMessages(prev => [...prev, aiMsg]);
        }, delay * (index + 1));
      });
    }
  };

  if (view === AppView.LOGIN || view === AppView.SIGNUP) {
    return (
      <AuthScreen 
        view={view} 
        onSwitchView={setView} 
        onAuthenticated={handleAuthenticated} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-darkBg text-slate-200 font-sans overflow-hidden">
      {/* Mobile Menu Button - positioned absolute over chat area if sidebar is closed */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-slate-800 rounded-lg text-slate-200 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <Sidebar 
        currentView={view}
        onChangeView={setView}
        currentUser={currentUser!}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {view === AppView.PROFILE ? (
        <ProfileEdit 
          user={currentUser!}
          onUpdateUser={handleUpdateUser}
          onCancel={() => setView(AppView.CHAT)}
        />
      ) : (
        <ChatArea 
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      )}
    </div>
  );
};

export default App;