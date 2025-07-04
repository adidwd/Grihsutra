# GitHub Repository & CI/CD Setup Guide

## 🚀 Quick Setup

### 1. Initialize Git Repository
```bash
# Initialize git in your project directory
git init

# Add all files
git add .

# Commit initial files
git commit -m "Initial commit: Grihsutra e-commerce platform"

# Set main branch
git branch -M main
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `grihsutra` (or your preferred name)
3. Don't initialize with README (we already have one)
4. Make it public or private as needed

### 3. Connect Local to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/grihsutra.git

# Push to GitHub
git push -u origin main
```

## ⚙️ CI/CD Configuration

### Required GitHub Secrets
Go to your repository → Settings → Secrets and Variables → Actions, and add:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DATABASE_URL` | Production PostgreSQL URL | `postgresql://user:pass@host:5432/dbname` |
| `RAILWAY_TOKEN` | Railway deployment token | Get from Railway dashboard |
| `PRODUCTION_URL` | Your live site URL | `https://grihsutra-production.up.railway.app` |

### Environment Variables for Railway
In your Railway project settings, add:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NODE_ENV` - Set to `production`
- `PORT` - Railway sets this automatically

## 🔄 Automated Workflows

### CI/CD Pipeline (`.github/workflows/ci-cd.yml`)
- **Triggers**: Push to `main`, PRs to `main`
- **Tests**: Build verification, type checking
- **Security**: Dependency audit, vulnerability scanning
- **Deploy**: Automatic deployment to Railway on main branch
- **Health Check**: Verifies deployment success

### Security Scanning (`.github/workflows/security.yml`)
- **Triggers**: Weekly schedule, manual trigger, PRs
- **Scans**: Dependencies, code security, secrets detection
- **Reports**: Uploads findings to GitHub Security tab

## 🚢 Deployment Options

### Option 1: Railway (Recommended)
1. Sign up at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy automatically on every push

### Option 2: Vercel + PlanetScale
1. Deploy frontend to Vercel
2. Use PlanetScale for database
3. Configure API routes for backend

### Option 3: Docker Deployment
```bash
# Build and run with Docker
docker build -t grihsutra .
docker run -p 3000:3000 grihsutra
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- URL: `/api/health`
- Returns: Server status, database connection, service health
- Used by: CI/CD pipeline for deployment verification

### Security Monitoring
- URL: `/api/security/status` (admin only)
- Tracks: IP blocks, suspicious activity, system uptime
- Real-time threat monitoring

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create PR on GitHub
```

### 2. Code Review Process
- All changes require PR review
- Automated tests must pass
- Security scans must be clean
- No direct commits to main branch

### 3. Release Process
- Merge PR to main branch
- Automated deployment to production
- Health checks verify deployment
- Monitor for any issues

## 🛡️ Security Features

### Automated Security
- Dependency vulnerability scanning
- Code security analysis (CodeQL)
- Secret detection in commits
- Weekly security audits

### Runtime Protection
- 8-layer security middleware
- Bot detection and blocking
- Rate limiting per endpoint
- SQL injection prevention
- XSS protection
- CSRF protection

## 📈 Performance Monitoring

### Metrics to Track
- Response times
- Error rates
- Security incidents
- User activity
- Database performance

### Tools Integration
- GitHub Security Dashboard
- Railway Analytics
- Custom logging endpoints

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 20+)
   - Verify all dependencies are installed
   - Check TypeScript compilation errors

2. **Database Connection**
   - Verify DATABASE_URL is correct
   - Check database is accessible
   - Run `npm run db:push` for schema sync

3. **Deployment Issues**
   - Check Railway logs
   - Verify environment variables
   - Test health check endpoint

### Getting Help
- Create GitHub issues for bugs
- Check Railway documentation
- Review security logs for blocks

## ✅ Post-Deployment Checklist

- [ ] Repository created and code pushed
- [ ] GitHub secrets configured
- [ ] Railway project connected
- [ ] Environment variables set
- [ ] Database schema deployed
- [ ] Health check passing
- [ ] Security scans clean
- [ ] Admin login working
- [ ] All features tested in production

---

**Need Help?** 
- 📧 Email: support@grihsutra.com
- 🐛 Issues: GitHub repository issues
- 📚 Docs: Check README.md and DEPLOYMENT.md