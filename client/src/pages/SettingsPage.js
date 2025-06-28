import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const { user, subscription } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and subscription
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Member Since
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Subscription
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plan
            </label>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {subscription?.plan || 'Free'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {subscription?.status || 'Active'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usage This Month
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {subscription?.usage?.postsThisMonth || 0} / {subscription?.limits?.posts === -1 ? '∞' : subscription?.limits?.posts || 10} posts
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-12 text-center">
          <Cog6ToothIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            More Settings Coming Soon
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Additional settings and configuration options will be available here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
