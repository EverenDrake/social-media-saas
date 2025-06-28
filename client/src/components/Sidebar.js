import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PencilSquareIcon, PresentationChartLineIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 shadow-md">
      <nav className="space-y-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-3 space-x-3 rounded-md ${
              isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <HomeIcon className="h-6 w-6" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/posts"
          className={({ isActive }) =>
            `flex items-center p-3 space-x-3 rounded-md ${
              isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <PencilSquareIcon className="h-6 w-6" />
          <span>Posts</span>
        </NavLink>

        <NavLink
          to="/social-accounts"
          className={({ isActive }) =>
            `flex items-center p-3 space-x-3 rounded-md ${
              isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <UserGroupIcon className="h-6 w-6" />
          <span>Social Accounts</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center p-3 space-x-3 rounded-md ${
              isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <PresentationChartLineIcon className="h-6 w-6" />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center p-3 space-x-3 rounded-md ${
              isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Cog6ToothIcon className="h-6 w-6" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

