import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BellIcon, UserCircleIcon, SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-dark-700 transition-colors">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-accent-violet mr-2 animate-pulse-slow" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-accent-violet to-accent-indigo bg-clip-text text-transparent">
              SocialSync
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
              <BellIcon className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <UserCircleIcon className="h-8 w-8" />
                <span>{user?.username}</span>
              </button>
            </div>
            
            <button
              onClick={signOut}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
