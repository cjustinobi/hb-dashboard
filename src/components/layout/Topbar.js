import React from 'react';
import { Clock } from 'lucide-react';

const Topbar = ({ title }) => {
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
    <div className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 flex-shrink-0">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      
      <div className="flex items-center space-x-2 text-gray-500 text-sm">
        <Clock size={16} />
        <span>{currentDate} • {currentTime}</span>
      </div>
    </div>
  );
};

export default Topbar;
