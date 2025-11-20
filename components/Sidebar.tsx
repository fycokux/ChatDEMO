import React from 'react';
import { User, AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  currentUser: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NEIGHBORS = [
  { id: '1', name: 'Mrs. Higgins', role: 'Neighborhood Watch', color: '#ef4444' },
  { id: '2', name: 'Dave the Plumber', role: 'Local Handyman', color: '#3b82f6' },
  { id: '3', name: 'Sarah (Baker)', role: 'Sourdough Enthusiast', color: '#f59e0b' },
  { id: '4', name: 'Officer Miller', role: 'Safety First', color: '#10b981' },
  { id: '5', name: 'Techie Tom', role: 'Digital Nomad', color: '#8b5cf6' },
  { id: '6', name: 'Gardener Green', role: 'Green Thumb', color: '#14b8a6' },
  { id: '7', name: 'Coach Carter', role: 'High School Sports', color: '#f97316' },
  { id: '8', name: 'Dr. Patel', role: 'General Practitioner', color: '#ec4899' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  currentUser,
  onLogout,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-72 bg-darkSurface border-r border-slate-700 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900/20">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight">Neighbor<span className="text-primary">.ai</span></h1>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          
          {/* Navigation Menu */}
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
            
            <button
              onClick={() => {
                onChangeView(AppView.CHAT);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${currentView === AppView.CHAT
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <span className="text-lg">💬</span>
              <span>Chat Room</span>
            </button>

            <button
              onClick={() => {
                onChangeView(AppView.PROFILE);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${currentView === AppView.PROFILE
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <span className="text-lg">👤</span>
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Online Neighbors Section */}
          <div className="space-y-2">
             <div className="px-3 flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Online Neighbors</p>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">{MOCK_NEIGHBORS.length}</span>
             </div>
             
             <div className="space-y-1">
                {MOCK_NEIGHBORS.map(neighbor => (
                    <div key={neighbor.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group cursor-default">
                        <div className="relative shrink-0">
                             <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: neighbor.color }}>
                                {neighbor.name[0]}
                             </div>
                             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-darkSurface rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-300 group-hover:text-slate-200 truncate">{neighbor.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{neighbor.role}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-inner overflow-hidden bg-slate-700 shrink-0"
              style={{ backgroundColor: !currentUser.avatarImage ? currentUser.avatarColor : undefined }}
            >
              {currentUser.avatarImage ? (
                <img src={currentUser.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{currentUser.username}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-slate-500 truncate">Online</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};