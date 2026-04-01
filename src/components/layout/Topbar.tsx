import React from 'react';

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 transition-all">
      <div className="pl-14 lg:pl-0">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>
      
      <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
        <span className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>{currentDate}</span>
        </span>
        <span className="w-px h-4 bg-gray-200"></span>
        <span>{currentTime}</span>
      </div>
    </header>
  );
};

export default Topbar;
