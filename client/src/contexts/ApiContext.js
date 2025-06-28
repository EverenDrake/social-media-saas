import React, { createContext, useContext } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  // Posts API
  const posts = {
    getAll: (params = {}) => axios.get('/posts', { params }),
    getById: (id) => axios.get(`/posts/${id}`),
    create: (formData) => axios.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => axios.put(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => axios.delete(`/posts/${id}`),
    cancel: (id) => axios.patch(`/posts/${id}/cancel`)
  };

  // Social Accounts API
  const socialAccounts = {
    getAll: () => axios.get('/social-accounts'),
    connect: (data) => axios.post('/social-accounts/connect', data),
    disconnect: (id) => axios.delete(`/social-accounts/${id}`),
    update: (id, data) => axios.patch(`/social-accounts/${id}`, data),
    refresh: (id) => axios.post(`/social-accounts/${id}/refresh`)
  };

  // Analytics API
  const analytics = {
    getDashboard: () => axios.get('/analytics/dashboard'),
    getPostsAnalytics: (params = {}) => axios.get('/analytics/posts', { params }),
    getEngagement: (params = {}) => axios.get('/analytics/engagement', { params })
  };

  // Subscriptions API
  const subscriptions = {
    get: () => axios.get('/subscriptions'),
    updatePlan: (plan) => axios.patch('/subscriptions/plan', { plan }),
    createCheckoutSession: (priceId) => axios.post('/subscriptions/checkout', { priceId }),
    cancelSubscription: () => axios.post('/subscriptions/cancel')
  };

  // Users API
  const users = {
    getProfile: () => axios.get('/users/profile'),
    updateProfile: (data) => axios.put('/users/profile', data)
  };

  const value = {
    posts,
    socialAccounts,
    analytics,
    subscriptions,
    users
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};
