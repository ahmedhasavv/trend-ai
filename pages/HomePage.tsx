
import React, { useState, useMemo } from 'react';
import { TRENDS } from '../constants';
import { TrendCategory } from '../types';
import TrendCard from '../components/TrendCard';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrendCategory | 'All'>('All');

  const categories = ['All', ...Object.values(TrendCategory)];

  const filteredTrends = useMemo(() => {
    return TRENDS.filter(trend => {
      const matchesCategory = selectedCategory === 'All' || trend.category === selectedCategory;
      const matchesSearch = trend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            trend.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Latest AI Trends</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Pick a trend, upload your photo, and let our AI create something amazing for you.
        </p>
      </div>

      <div className="mb-8 sticky top-16 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md py-4 z-40">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search trends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
          />
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as TrendCategory | 'All')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTrends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredTrends.map(trend => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">No trends found. Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
