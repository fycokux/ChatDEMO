import React from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarColor: string;
  avatarImage?: string;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string; // 'ai' or user id
  senderName: string;
  content: string;
  timestamp: number;
  isUser: boolean;
  avatarColor?: string;
  avatarImage?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export enum AppView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
}

// Gemini Service Types
export interface AIResponseItem {
  senderName: string;
  content: string;
  emoji: string;
}