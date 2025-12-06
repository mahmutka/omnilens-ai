import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-white text-lg font-medium animate-pulse">Analyzing Object...</p>
      <p className="text-white/60 text-sm mt-1">AI is thinking ✨</p>
    </div>
  );
};

export default LoadingOverlay;