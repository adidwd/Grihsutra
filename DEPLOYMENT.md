# TextileHome Deployment Guide

This guide covers various deployment options for the TextileHome e-commerce platform.

## 🚀 Quick Start Deployment

### Local Development
```bash
git clone https://github.com/yourusername/textilehome.git
cd textilehome
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Production Deployment
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🐳 Docker Deployment

### Single Container
```bash
docker build -t textilehome .
docker run -p 5000:5000 -e DATABASE_URL="your_db_url" textilehome
```

### Docker Compose (with PostgreSQL)
```bash
cp .env.example .env
# Edit .env with your configurations
docker-compose up -d
```

## ☁️ Cloud Platform Deployments

### Railway
1. Connect your GitHub repository to Railway
2. Add environment variables:
   - `DATABASE_URL` (Railway will provide PostgreSQL)
   - `NODE_ENV=production`
3. Railway will automatically deploy on push to main

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard
4. Note: You'll need external PostgreSQL (Neon, Supabase, etc.)

### Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

### DigitalOcean App Platform
1. Create new app from GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Add managed PostgreSQL database
4. Set environment variables

### AWS ECS/Fargate
1. Push Docker image to ECR
2. Create ECS task definition
3. Set up RDS PostgreSQL instance
4. Configure load balancer and security groups

## 🔒 Security Configuration

### Environment Variables
Required for production:
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to "production"
- `PORT`: Application port (default: 5000)

Optional security variables:
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `RATE_LIMIT_MAX`: Maximum requests per window
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds

### Database Setup
1. Create PostgreSQL database
2. Run migrations: `npm run db:push`
3. Seed initial data: `npm run db:seed`

### SSL/TLS
- Use reverse proxy (nginx, Cloudflare) for SSL termination
- Ensure HTTPS in production environments
- Configure HSTS headers (handled by Helmet middleware)

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- URL: `/api/products/featured`
- Method: GET
- Expected: 200 status with product data

### Security Monitoring
- URL: `/api/security/status`
- Method: GET
- Returns: Blocked IPs and suspicious activity

### Application Metrics
Monitor these key metrics:
- Response time on API endpoints
- Database connection pool status
- Memory and CPU usage
- Error rates and status codes

## 🔄 CI/CD Pipeline

### GitHub Actions
The repository includes workflows for:
- **CI Pipeline**: Testing and building on every push
- **Security Scanning**: Daily vulnerability scans
- **Deployment**: Automatic deployment to production

### Required Secrets
Add these to GitHub repository secrets:
- `DATABASE_URL`: Production database URL
- `DEPLOY_TOKEN`: Deployment service token

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**
```bash
pkill -f "tsx server/index.ts"
# or
lsof -ti:5000 | xargs kill -9
```

**Database Connection Failed**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database server is running

**Rate Limiting in Development**
- Restart the application to clear IP blocks
- Development has higher rate limits (100/min vs 30/min)

**Build Failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Performance Optimization
- Enable gzip compression via reverse proxy
- Use CDN for static assets
- Implement database connection pooling
- Monitor and optimize database queries

## 📈 Scaling Considerations

### Horizontal Scaling
- Application is stateless (session data in database)
- Use load balancer to distribute traffic
- Scale database with read replicas

### Database Scaling
- Implement connection pooling
- Consider database sharding for high traffic
- Use caching layer (Redis) for frequently accessed data

### Security at Scale
- Implement distributed rate limiting
- Use Web Application Firewall (WAF)
- Monitor for DDoS attacks
- Implement geographic IP blocking if needed

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review security monitoring endpoint
5. Contact support with error details