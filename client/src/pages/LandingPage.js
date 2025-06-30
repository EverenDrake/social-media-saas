import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ChartBarIcon, ClockIcon, GlobeAltIcon, UserGroupIcon, SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: ClockIcon, title: 'Smart Scheduling', desc: 'Schedule posts across multiple platforms with optimal timing suggestions.' },
    { icon: GlobeAltIcon, title: 'Multi-Platform Support', desc: 'Connect and manage Twitter, Facebook, Instagram, LinkedIn, and TikTok accounts.' },
    { icon: ChartBarIcon, title: 'Analytics & Insights', desc: 'Track engagement, reach, and performance across all your social media channels.' },
    { icon: UserGroupIcon, title: 'Team Collaboration', desc: 'Work together with your team to plan and execute your social media strategy.' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-all duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center animate-slide-in-left">
              <SparklesIcon className="h-8 w-8 text-accent-violet mr-2 animate-pulse-slow" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-violet to-accent-indigo bg-clip-text text-transparent">
                SocialSync
              </h1>
            </div>
            <div className="flex items-center space-x-4 animate-slide-in-right">
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
              <Link
                to="/login"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-accent-violet to-accent-indigo hover:from-accent-indigo hover:to-accent-violet text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-glow"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 via-transparent to-accent-indigo/10 dark:from-accent-violet/20 dark:to-accent-indigo/20"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className={`sm:text-center lg:text-left transition-all duration-1000 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline animate-fade-in">Automate your</span>{' '}
                  <span className="block bg-gradient-to-r from-accent-violet to-accent-indigo bg-clip-text text-transparent xl:inline animate-fade-in animation-delay-200">
                    social media
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in animation-delay-400">
                  Schedule, manage, and analyze your social media posts across multiple platforms from one centralized dashboard.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start animate-fade-in animation-delay-600">
                  <div className="rounded-md shadow-lg">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-accent-violet to-accent-indigo hover:from-accent-indigo hover:to-accent-violet md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-glow"
                    >
                      Start free trial
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-dark-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
          <div className="h-56 w-full bg-gradient-to-br from-accent-violet via-accent-indigo to-accent-teal sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/80 via-accent-indigo/80 to-accent-teal/80 animate-gradient"></div>
            <div className="text-white text-center relative z-10 animate-fade-in animation-delay-800">
              <div className="relative">
                <ChartBarIcon className="h-32 w-32 mx-auto mb-4 animate-bounce-slow" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-green rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-neon-pink rounded-full animate-ping animation-delay-500"></div>
              </div>
              <p className="text-xl font-semibold animate-pulse-slow">Social Media Dashboard</p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-dark-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center animate-fade-in">
            <h2 className="text-base text-accent-violet font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage your social media
            </p>
            <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-accent-violet to-accent-indigo rounded-full"></div>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className={`relative group animate-slide-up transition-all duration-500 hover:scale-105`} style={{animationDelay: `${index * 200}ms`}}>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-accent-violet to-accent-indigo text-white shadow-lg group-hover:shadow-xl group-hover:animate-glow transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white group-hover:text-accent-violet dark:group-hover:text-accent-indigo transition-colors">
                      {feature.title}
                    </p>
                    <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white dark:bg-dark-900 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:text-center animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that's right for your business
            </p>
            <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-accent-violet to-accent-indigo rounded-full"></div>
          </div>
          <div className="mt-16 space-y-4 sm:mt-20 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-5xl lg:mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 dark:border-dark-600 rounded-xl shadow-lg p-8 bg-white dark:bg-dark-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Perfect for getting started</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-accent-emerald to-accent-teal bg-clip-text text-transparent">$0</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <span className="text-accent-emerald text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">10 posts per month</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-emerald text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">3 social accounts</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-emerald text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Basic scheduling</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="relative border-2 border-accent-violet rounded-xl shadow-2xl p-8 bg-white dark:bg-dark-800 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 animate-slide-up animation-delay-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-accent-violet to-accent-indigo text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">For growing businesses</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-accent-violet to-accent-indigo bg-clip-text text-transparent">$29</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <span className="text-accent-violet text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">500 posts per month</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-violet text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">25 social accounts</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-violet text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-violet text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Team collaboration</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-gray-200 dark:border-dark-600 rounded-xl shadow-lg p-8 bg-white dark:bg-dark-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up animation-delay-400">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enterprise</h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">For large organizations</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-accent-amber to-accent-rose bg-clip-text text-transparent">$99</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <span className="text-accent-amber text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Unlimited posts</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-amber text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Unlimited accounts</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-amber text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="text-accent-amber text-xl">✓</span>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 transition-colors">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <SparklesIcon className="h-6 w-6 text-accent-violet mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-accent-violet to-accent-indigo bg-clip-text text-transparent">
                SocialSync
              </span>
            </div>
            <p className="text-base text-gray-500 dark:text-gray-400">
              © 2024 SocialSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
