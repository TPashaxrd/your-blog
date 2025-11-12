
import React from 'react';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <header className="bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              <span className="text-cyan-400">Market</span> Terminal
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`relative flex h-3 w-3`}>
              <div className={`absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} ${isConnected ? 'animate-ping' : ''} opacity-75`}></div>
              <div className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'LIVE' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
