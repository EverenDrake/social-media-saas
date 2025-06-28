import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your social media performance and engagement
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-12 text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Analytics Coming Soon
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            This feature is under construction. Check back later for detailed analytics and reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
