import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { posts, socialAccounts } = useApi();
  const { subscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    content: '',
    scheduledAt: '',
    platforms: [],
    tags: '',
    timezone: 'UTC'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const loadSocialAccounts = useCallback(async () => {
    try {
      const response = await socialAccounts.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error loading social accounts:', error);
      toast.error('Failed to load social accounts');
    }
  }, [socialAccounts]);

  useEffect(() => {
    loadSocialAccounts();
    setDefaultScheduleTime();
  }, [loadSocialAccounts]);

  const setDefaultScheduleTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const formatted = now.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, scheduledAt: formatted }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (accountId, platform, checked) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked
        ? [...prev.platforms, { socialAccount: accountId, platform }]
        : prev.platforms.filter(p => p.socialAccount !== accountId)
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast.error('Post content is required');
      return;
    }

    if (formData.platforms.length === 0) {
      toast.error('Please select at least one social media platform');
      return;
    }

    if (subscription?.hasReachedLimit('posts')) {
      toast.error('You have reached your monthly post limit. Please upgrade your plan.');
      return;
    }

    setLoading(true);

    try {
      const postFormData = new FormData();
      postFormData.append('content', formData.content);
      postFormData.append('scheduledAt', formData.scheduledAt);
      postFormData.append('timezone', formData.timezone);
      postFormData.append('platforms', JSON.stringify(formData.platforms));
      
      if (formData.tags) {
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        postFormData.append('tags', JSON.stringify(tags));
      }

      selectedFiles.forEach(file => {
        postFormData.append('media', file);
      });

      await posts.create(postFormData);
      toast.success('Post scheduled successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create Post
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Schedule a new post across your social media platforms
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Post Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Post Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="What's on your mind?"
                value={formData.content}
                onChange={handleChange}
                maxLength={2000}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.content.length}/2000 characters
              </p>
            </div>

            {/* Media Upload */}
            <div>
              <label htmlFor="media" className="block text-sm font-medium text-gray-700">
                Media (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="media"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="media"
                        name="media"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, MP4 up to 50MB
                  </p>
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected files: {selectedFiles.map(f => f.name).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Schedule Time */}
            <div>
              <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
                Schedule Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  id="scheduledAt"
                  className="block w-full pl-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (Optional)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="marketing, product, announcement (separate with commas)"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Select Platforms
          </h3>
          
          {accounts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-2">No social media accounts connected</p>
              <p className="text-sm text-gray-400">
                Connect your social media accounts to start posting
              </p>
              <button
                type="button"
                onClick={() => navigate('/social-accounts')}
                className="mt-4 btn-secondary"
              >
                Connect Accounts
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {account.platform === 'twitter' ? '🐦' :
                       account.platform === 'facebook' ? '📘' :
                       account.platform === 'instagram' ? '📷' :
                       account.platform === 'linkedin' ? '💼' :
                       account.platform === 'tiktok' ? '🎵' : '📱'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {account.accountName}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {account.platform}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.platforms.some(p => p.socialAccount === account._id)}
                    onChange={(e) => handlePlatformChange(
                      account._id,
                      account.platform,
                      e.target.checked
                    )}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/posts')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || accounts.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Scheduling...' : 'Schedule Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
