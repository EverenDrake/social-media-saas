import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              SocialSync
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                <UserCircleIcon className="h-8 w-8" />
                <span>{user?.username}</span>
              </button>
            </div>
            
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
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
