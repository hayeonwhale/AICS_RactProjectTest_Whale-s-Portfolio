import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "border-2 border-gray-800 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: `bg-[#ffc8dd] text-gray-900 px-6 py-2 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffb3c6] font-bold text-xl tracking-wide`,
    icon: `bg-[#bde0fe] p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-[#a2d2ff]`
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};