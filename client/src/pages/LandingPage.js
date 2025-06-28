import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChartBarIcon, ClockIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">SocialSync</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Automate your</span>{' '}
                  <span className="block text-indigo-600 xl:inline">social media</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Schedule, manage, and analyze your social media posts across multiple platforms from one centralized dashboard.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Start free trial
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-indigo-500 to-purple-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <ChartBarIcon className="h-32 w-32 mx-auto mb-4" />
              <p className="text-xl font-semibold">Social Media Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your social media
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Scheduling</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Schedule posts across multiple platforms with optimal timing suggestions.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <GlobeAltIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Multi-Platform Support</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Connect and manage Twitter, Facebook, Instagram, LinkedIn, and TikTok accounts.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Analytics & Insights</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Track engagement, reach, and performance across all your social media channels.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Team Collaboration</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Work together with your team to plan and execute your social media strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that's right for your business
            </p>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Free</h3>
              <p className="mt-4 text-sm text-gray-500">Perfect for getting started</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">10 posts per month</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">3 social accounts</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Basic scheduling</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-indigo-500 rounded-lg shadow-sm p-6 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Pro</h3>
              <p className="mt-4 text-sm text-gray-500">For growing businesses</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$29</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">500 posts per month</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">25 social accounts</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Advanced analytics</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Team collaboration</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Enterprise</h3>
              <p className="mt-4 text-sm text-gray-500">For large organizations</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$99</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Unlimited posts</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Unlimited accounts</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Advanced analytics</span>
                </li>
                <li className="flex">
                  <span className="text-green-500">✓</span>
                  <span className="ml-3 text-sm text-gray-500">Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              © 2024 SocialSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
