# 🚀 SocialSync Production Deployment Guide

## 📋 Prerequisites

Before deploying SocialSync to production, ensure you have:

### 1. **External Services Setup**

#### MongoDB Atlas
- Create a MongoDB Atlas cluster
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/social-media-saas`

#### SendGrid (Email Service)
- Sign up for SendGrid account
- Get API key and verify sender email

#### Stripe (Payments)
- Create Stripe account
- Get Secret Key, Publishable Key, and Webhook Secret
- Set up webhook endpoint: `https://yourapp.com/api/payments/webhook`

#### Social Media APIs
- **Twitter**: Create Twitter Developer App
- **Facebook**: Create Facebook App with Pages permission
- **Instagram**: Set up Instagram Basic Display API
- **LinkedIn**: Create LinkedIn App with sharing permissions

#### AWS S3 (File Storage)
- Create S3 bucket for media uploads
- Get Access Key ID and Secret Access Key

### 2. **Domain & SSL**
- Purchase domain name
- Set up SSL certificate (Let's Encrypt recommended)

## 🌐 Deployment Options

### Option 1: Cloud Platforms (Recommended)

#### A. Vercel + MongoDB Atlas
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build the application
npm run build-production

# 3. Deploy to Vercel
vercel --prod

# 4. Set environment variables in Vercel dashboard
```

#### B. Heroku
```bash
# 1. Install Heroku CLI
# 2. Create Heroku app
heroku create socialsync-app

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
# ... add all other environment variables

# 4. Deploy
git push heroku main
```

#### C. DigitalOcean App Platform
```bash
# 1. Connect GitHub repository
# 2. Set build command: npm run heroku-build
# 3. Set run command: npm run heroku-start
# 4. Add environment variables in dashboard
```

### Option 2: VPS/Docker Deployment

#### Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- 2GB+ RAM
- 2+ CPU cores
- 20GB+ storage

#### Setup Steps
```bash
# 1. Update server
sudo apt update && sudo apt upgrade -y

# 2. Install Docker and Docker Compose
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 3. Clone repository
git clone <your-repo-url>
cd social-media-saas

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your production values

# 5. Deploy with Docker
docker-compose up -d
```

## 🔧 Environment Variables Setup

Create `.env` file in the root directory with these variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-saas

# JWT Secret (generate strong secret)
JWT_SECRET=your-super-secure-jwt-secret-key

# Frontend URL
CLIENT_URL=https://your-domain.com

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@your-domain.com

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Social Media OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=https://your-domain.com/api/oauth/twitter/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://your-domain.com/api/oauth/facebook/callback

INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=https://your-domain.com/api/oauth/linkedin/callback

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Redis (if using external Redis)
REDIS_URL=redis://your-redis-url:6379
```

## 🛡️ Security Checklist

### Pre-Deployment
- [ ] Change all default passwords
- [ ] Use strong JWT secret (64+ characters)
- [ ] Enable rate limiting
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Validate all environment variables

### Post-Deployment
- [ ] Test all authentication flows
- [ ] Verify OAuth integrations
- [ ] Test payment processing
- [ ] Check email notifications
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

## 📊 Monitoring & Maintenance

### Log Management
```bash
# View application logs
docker-compose logs -f app

# Monitor database
docker-compose logs -f mongodb

# Check system resources
docker stats
```

### Database Backup
```bash
# Backup MongoDB
mongodump --uri="your_mongodb_connection_string" --out=./backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="your_mongodb_connection_string" ./backup/20240101
```

### Health Checks
- Monitor `/api/health` endpoint
- Set up alerts for failed payments
- Track user registration/login rates
- Monitor social media API rate limits

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm run install-all
    
    - name: Build application
      run: npm run build-production
    
    - name: Deploy to cloud platform
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## 🆘 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check connection string format
# Ensure IP whitelist includes your server
# Verify username/password
```

#### OAuth Redirect Issues
```bash
# Verify callback URLs in social media apps
# Check HTTPS requirement for production
# Ensure CLIENT_URL environment variable is correct
```

#### Email Not Sending
```bash
# Verify SendGrid API key
# Check sender email verification
# Review email templates for errors
```

#### Payment Processing Failed
```bash
# Verify Stripe keys (test vs live)
# Check webhook endpoint configuration
# Review Stripe dashboard for errors
```

## 📈 Scaling Considerations

### Database Optimization
- Add indexes for frequently queried fields
- Implement database connection pooling
- Consider read replicas for analytics

### Application Scaling
- Use horizontal scaling with load balancer
- Implement Redis for session storage
- Add CDN for static assets

### Cost Optimization
- Monitor usage and adjust resources
- Implement auto-scaling
- Use reserved instances for predictable workloads

## 📞 Support

For deployment issues:
1. Check logs first: `docker-compose logs`
2. Review environment variables
3. Verify external service configurations
4. Contact support with specific error messages

---

**Ready to deploy? Choose your deployment method above and follow the steps carefully!**
