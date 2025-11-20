import React, { useState } from 'react';
import { AppView, User } from '../types';
import { Button } from './Button';
import { Input } from './Input';

interface AuthScreenProps {
  view: AppView.LOGIN | AppView.SIGNUP;
  onSwitchView: (view: AppView) => void;
  onAuthenticated: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ view, onSwitchView, onAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      if (view === AppView.LOGIN) {
        // Mock Login Logic
        const storedUserStr = localStorage.getItem(`user_${formData.email}`);
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          if (storedUser.password === formData.password) {
             onAuthenticated({
               id: storedUser.id,
               username: storedUser.username,
               email: storedUser.email,
               avatarColor: storedUser.avatarColor
             });
          } else {
            setError('Invalid credentials');
          }
        } else {
          // For demo purposes, allow any login if not found, or strictly fail.
          // Let's strictly fail to encourage "signup".
          setError('User not found. Please sign up.');
        }
      } else {
        // Mock Signup Logic
        if (!formData.username || !formData.email || !formData.password) {
          setError('All fields are required');
          setIsLoading(false);
          return;
        }
        
        const newUser = {
          id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          password: formData.password, // In real app, never store plain text
          avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16)
        };
        
        localStorage.setItem(`user_${formData.email}`, JSON.stringify(newUser));
        onAuthenticated({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            avatarColor: newUser.avatarColor
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const isLogin = view === AppView.LOGIN;

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg px-4">
      <div className="max-w-md w-full bg-darkSurface p-8 rounded-2xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Join the Neighborhood'}
          </h2>
          <p className="text-slate-400 mt-2">
            {isLogin ? 'Connect with your local community' : 'Create your account to start chatting'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <Input
              label="Username"
              name="username"
              placeholder="e.g. NeighborNan"
              value={formData.username}
              onChange={handleChange}
            />
          )}
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3" isLoading={isLoading}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => onSwitchView(isLogin ? AppView.SIGNUP : AppView.LOGIN)}
              className="text-primary hover:text-primaryHover font-semibold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};