import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SocialAccountsPage = () => {
  const { socialAccounts } = useApi();
  const { subscription } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [connectForm, setConnectForm] = useState({
    platform: '',
    accountName: '',
    accountId: ''
  });

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialAccounts.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast.error('Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  }, [socialAccounts]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleConnect = async (e) => {
    e.preventDefault();
    
    if (subscription?.hasReachedLimit('socialAccounts')) {
      toast.error('You have reached your social account limit. Please upgrade your plan.');
      return;
    }

    try {
      const response = await socialAccounts.connect(connectForm);
      setAccounts([...accounts, response.data.account]);
      setShowConnectForm(false);
      setConnectForm({ platform: '', accountName: '', accountId: '' });
      toast.success('Social account connected successfully!');
    } catch (error) {
      console.error('Error connecting account:', error);
      toast.error(error.response?.data?.message || 'Failed to connect account');
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!window.confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      await socialAccounts.disconnect(accountId);
      setAccounts(accounts.filter(account => account._id !== accountId));
      toast.success('Account disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast.error('Failed to disconnect account');
    }
  };

  const handleRefresh = async (accountId) => {
    try {
      const response = await socialAccounts.refresh(accountId);
      setAccounts(accounts.map(account => 
        account._id === accountId ? response.data.account : account
      ));
      toast.success('Account data refreshed');
    } catch (error) {
      console.error('Error refreshing account:', error);
      toast.error('Failed to refresh account data');
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: '🐦',
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
      tiktok: '🎵'
    };
    return icons[platform] || '📱';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Social Media Accounts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Connect and manage your social media accounts
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowConnectForm(true)}
            className="btn-primary inline-flex items-center"
            disabled={subscription?.hasReachedLimit('socialAccounts')}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Connect Account
          </button>
        </div>
      </div>

      {/* Usage Info */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Connected Accounts: {accounts.length} / {subscription?.limits.socialAccounts === -1 ? '∞' : subscription?.limits.socialAccounts}
            </p>
          </div>
          {subscription?.limits.socialAccounts !== -1 && (
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (accounts.length / subscription.limits.socialAccounts) * 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Connect Form Modal */}
      {showConnectForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Connect Social Media Account
            </h3>
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Platform
                </label>
                <select
                  value={connectForm.platform}
                  onChange={(e) => setConnectForm({...connectForm, platform: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select platform</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Name
                </label>
                <input
                  type="text"
                  value={connectForm.accountName}
                  onChange={(e) => setConnectForm({...connectForm, accountName: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="@username or account name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account ID
                </label>
                <input
                  type="text"
                  value={connectForm.accountId}
                  onChange={(e) => setConnectForm({...connectForm, accountId: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Unique account identifier"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConnectForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accounts List */}
      <div className="bg-white shadow rounded-lg">
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No social media accounts connected</p>
            <p className="text-sm text-gray-400 mb-4">
              Connect your first social media account to start scheduling posts
            </p>
            <button
              onClick={() => setShowConnectForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Connect Account
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <div key={account._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-3xl">
                        {getPlatformIcon(account.platform)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {account.accountName}
                        </h3>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">
                        {account.platform}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span>{formatNumber(account.followers)} followers</span>
                        <span className="mx-2">•</span>
                        <span>{formatNumber(account.following)} following</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Connected on {new Date(account.connectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRefresh(account._id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Refresh account data"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDisconnect(account._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Disconnect account"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          How to connect your accounts
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• This is a demo - accounts are simulated for testing purposes</li>
          <li>• In production, you would authenticate through OAuth flows</li>
          <li>• Real implementations require API keys and proper permissions</li>
          <li>• Account stats are randomly generated for demonstration</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialAccountsPage;
