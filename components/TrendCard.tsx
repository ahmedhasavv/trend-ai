
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trend } from '../types';
import { SparklesIcon } from './icons';

interface TrendCardProps {
  trend: Trend;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const navigate = useNavigate();

  const handleUseTrend = () => {
    navigate(`/editor/${trend.id}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <img
        src={trend.exampleImage}
        alt={trend.name}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <h3 className="text-xl font-bold text-white">{trend.name}</h3>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{trend.description}</p>
        <button
          onClick={handleUseTrend}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white rounded-md font-semibold text-sm hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
        >
          <SparklesIcon className="h-4 w-4" />
          <span>Use This Trend</span>
        </button>
      </div>
    </div>
  );
};

export default TrendCard;
