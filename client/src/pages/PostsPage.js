import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PostsPage = () => {
  const { posts } = useApi();
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await posts.getAll(params);
      setPostsList(response.data.posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [posts, filter]);

  useEffect(() => {
    loadPosts();
  }, [filter, loadPosts]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await posts.delete(postId);
      setPostsList(postsList.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'posted': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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
            Posts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your scheduled and published social media posts
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/posts/create"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            {['all', 'scheduled', 'posted', 'failed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filter === status
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="divide-y divide-gray-200">
          {postsList.length === 0 ? (
            <div className="text-center py-12">
              <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No posts found</p>
              <p className="text-sm text-gray-400 mb-4">
                {filter === 'all' 
                  ? 'Create your first post to get started'
                  : `No ${filter} posts at the moment`
                }
              </p>
              <Link
                to="/posts/create"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Post
              </Link>
            </div>
          ) : (
            postsList.map((post) => (
              <div key={post._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      <div className="flex space-x-1">
                        {post.platforms.map((platform, index) => (
                          <span key={index} className="text-lg" title={platform.platform}>
                            {getPlatformIcon(platform.platform)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {post.content}
                      </p>
                      {post.media && post.media.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          📎 {post.media.length} attachment{post.media.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>Scheduled for {formatDate(post.scheduledAt)}</span>
                      {post.status === 'posted' && post.platforms[0]?.postedAt && (
                        <span className="ml-4">
                          Posted on {formatDate(post.platforms[0].postedAt)}
                        </span>
                      )}
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/posts/${post._id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    
                    {(post.status === 'draft' || post.status === 'scheduled') && (
                      <Link
                        to={`/posts/${post._id}/edit`}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Edit post"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    )}
                    
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete post"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
