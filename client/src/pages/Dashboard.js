import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { PlusIcon, CalendarIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, subscription } = useAuth();
  const { posts, socialAccounts } = useApi();
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    postedToday: 0,
    connectedAccounts: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load recent posts
      const postsResponse = await posts.getAll({ limit: 5 });
      setRecentPosts(postsResponse.data.posts);
      
      // Load social accounts
      const accountsResponse = await socialAccounts.getAll();
      
      // Calculate stats
      const totalPosts = postsResponse.data.total;
      const scheduledPosts = postsResponse.data.posts.filter(post => post.status === 'scheduled').length;
      const today = new Date().toDateString();
      const postedToday = postsResponse.data.posts.filter(post => {
        return post.status === 'posted' && 
               new Date(post.platforms[0]?.postedAt).toDateString() === today;
      }).length;
      
      setStats({
        totalPosts,
        scheduledPosts,
        postedToday,
        connectedAccounts: accountsResponse.data.length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [posts, socialAccounts]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'posted': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
            Welcome back, {user?.username}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your social media accounts today.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Posts
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalPosts}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Scheduled Posts
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.scheduledPosts}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Connected Accounts
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.connectedAccounts}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Posted Today
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.postedToday}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
            <p className="text-sm text-gray-500">
              You're on the <span className="font-medium capitalize">{subscription?.plan}</span> plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {subscription?.usage.postsThisMonth}/{subscription?.limits.posts === -1 ? '∞' : subscription?.limits.posts} posts this month
            </p>
            <p className="text-sm text-gray-500">
              {stats.connectedAccounts}/{subscription?.limits.socialAccounts === -1 ? '∞' : subscription?.limits.socialAccounts} accounts connected
            </p>
          </div>
        </div>
        {subscription?.plan === 'free' && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-md">
            <p className="text-sm text-indigo-700">
              Upgrade to unlock more features and higher limits.
              <Link to="/settings" className="ml-2 font-medium underline">
                View plans
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
          <Link
            to="/posts"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        
        {recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No posts yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Create your first post to get started
            </p>
            <Link
              to="/posts/create"
              className="btn-primary mt-4 inline-flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    Scheduled for {formatDate(post.scheduledAt)}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            to="/posts/create"
            className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <PlusIcon className="h-5 w-5 text-indigo-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Create Post</span>
          </Link>
          
          <Link
            to="/social-accounts"
            className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <UserGroupIcon className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Connect Account</span>
          </Link>
          
          <Link
            to="/analytics"
            className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
