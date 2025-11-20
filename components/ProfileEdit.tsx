import React, { useState, useRef } from 'react';
import { User, AppView } from '../types';
import { Button } from './Button';
import { Input } from './Input';

interface ProfileEditProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onCancel: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onUpdateUser, onCancel }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarImage, setAvatarImage] = useState<string | undefined>(user.avatarImage);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit for local storage safety
        alert("File is too large. Please choose an image under 500KB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API save delay
    setTimeout(() => {
      onUpdateUser({
        ...user,
        username,
        bio,
        avatarImage
      });
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="flex-1 h-screen bg-darkBg flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-darkSurface rounded-2xl border border-slate-700 shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden flex items-center justify-center group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              style={{ backgroundColor: !avatarImage ? user.avatarColor : undefined }}
            >
              {avatarImage ? (
                <img src={avatarImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-white font-bold">{user.username.charAt(0).toUpperCase()}</span>
              )}
              
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-slate-400">Click to upload new photo</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="How neighbors see you"
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-400 ml-1">About Me</label>
              <textarea
                className="w-full bg-darkSurface border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none h-32"
                placeholder="Tell your neighbors a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
               <label className="text-sm font-medium text-slate-400 ml-1">Email</label>
               <div className="px-4 py-2.5 text-slate-500 bg-slate-800/50 rounded-lg border border-slate-800 cursor-not-allowed">
                 {user.email}
               </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};