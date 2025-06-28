# SocialSync - Social Media Automation SaaS

A complete SaaS platform for automating social media posting across multiple platforms including Twitter, Facebook, Instagram, LinkedIn, and TikTok.

## Features

- 🚀 **Multi-Platform Posting** - Schedule posts across multiple social media platforms
- 📅 **Smart Scheduling** - Advanced scheduling with timezone support
- 📊 **Analytics Dashboard** - Track engagement and performance metrics
- 👥 **Team Collaboration** - Manage team members and permissions
- 💳 **Subscription Management** - Multiple pricing tiers with usage limits
- 🔒 **Secure Authentication** - JWT-based authentication with role management
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Node-cron** for scheduled posting
- **Bcrypt** for password hashing

### Frontend
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Heroicons** for icons

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media-saas
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # In the server directory
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 3000).

## Project Structure

```
social-media-saas/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Custom middleware
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get user posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Social Accounts
- `GET /api/social-accounts` - Get connected accounts
- `POST /api/social-accounts/connect` - Connect new account
- `DELETE /api/social-accounts/:id` - Disconnect account

### Subscriptions
- `GET /api/subscriptions` - Get subscription details
- `PATCH /api/subscriptions/plan` - Update subscription plan

## Subscription Plans

### Free Plan
- 10 posts per month
- 3 social accounts
- Basic scheduling

### Basic Plan ($19/month)
- 100 posts per month
- 10 social accounts
- Analytics included
- 3 team members

### Pro Plan ($49/month)
- 500 posts per month
- 25 social accounts
- Advanced analytics
- Bulk upload
- 10 team members

### Enterprise Plan ($99/month)
- Unlimited posts
- Unlimited accounts
- Priority support
- Custom integrations

## Development

### Backend Development
```bash
cd server
npm run dev  # Starts with nodemon
```

### Frontend Development
```bash
cd client
npm start    # Starts React dev server
```

### Building for Production
```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

## Environment Variables

Key environment variables needed:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL for CORS
- `PORT` - Server port (default: 5000)

For social media integrations (production):
- Twitter API credentials
- Facebook App credentials
- Instagram Access Token
- LinkedIn API credentials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@socialsync.com or join our Discord community.

---

**Note**: This is a demo application. Social media integrations are mocked for demonstration purposes. In a production environment, you would need to implement proper OAuth flows and use official APIs from each platform.
