import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-slate-400 ml-1">{label}</label>}
      <input
        className={`
          w-full bg-darkSurface border border-slate-700 rounded-lg px-4 py-2.5 
          text-slate-200 placeholder-slate-500
          focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};