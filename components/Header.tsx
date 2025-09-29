
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../App';
import { MoonIcon, SparklesIcon, SunIcon } from './icons';
import { Theme, ThemeContextType } from '../types';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext) as ThemeContextType;

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-neon-blue'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center space-x-2">
              <SparklesIcon className="h-7 w-7 text-neon-purple" />
              <span className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                TrendAI
              </span>
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={getLinkClass}>Home</NavLink>
            <NavLink to="/editor" className={getLinkClass}>Editor</NavLink>
            <NavLink to="/gallery" className={getLinkClass}>My Gallery</NavLink>
          </nav>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
