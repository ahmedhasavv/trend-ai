
import React from 'react';
import { SparklesIcon } from './icons';

interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Generating your masterpiece..." }) => {
  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-lg">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border-4 border-t-neon-blue border-r-neon-blue border-b-neon-purple border-l-neon-purple animate-spin"></div>
        <SparklesIcon className="h-12 w-12 text-white animate-pulse-fast" />
      </div>
      <p className="mt-6 text-white font-semibold text-lg">{message}</p>
    </div>
  );
};

export default Loader;
