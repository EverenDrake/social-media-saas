const subscriptions = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      posts: 10,
      socialAccounts: 3,
      analytics: false,
      bulkUpload: false,
      teamMembers: 1
    }
  },
  basic: {
    name: 'Basic',
    price: 19,
    limits: {
      posts: 100,
      socialAccounts: 10,
      analytics: true,
      bulkUpload: false,
      teamMembers: 3
    }
  },
  pro: {
    name: 'Pro',
    price: 49,
    limits: {
      posts: 500,
      socialAccounts: 25,
      analytics: true,
      bulkUpload: true,
      teamMembers: 10
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    limits: {
      posts: -1, // Unlimited
      socialAccounts: -1, // Unlimited
      analytics: true,
      bulkUpload: true,
      teamMembers: -1 // Unlimited
    }
  }
};

module.exports = { subscriptions };
