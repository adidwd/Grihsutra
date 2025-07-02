# Contributing to TextileHome

Thank you for your interest in contributing to TextileHome! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database
- Git

### Setup Development Environment
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/textilehome.git
   cd textilehome
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
5. Set up database:
   ```bash
   npm run db:push
   npm run db:seed
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper error handling
- Include security considerations
- Write comprehensive comments

### Security Requirements
- Never disable security middleware without discussion
- Test security features thoroughly
- Follow principle of least privilege
- Validate all user inputs
- Use environment variables for sensitive data

### Database Changes
- Use Drizzle ORM for all database operations
- Create migrations for schema changes: `npm run db:generate`
- Test migrations thoroughly
- Include rollback procedures

## 🧪 Testing

### Running Tests
```bash
npm test                 # Run all tests
npm run test:security    # Run security tests
npm run test:integration # Run integration tests
```

### Writing Tests
- Include tests for new features
- Test security middleware
- Test error handling
- Include integration tests for API endpoints

## 🔒 Security Considerations

### Reporting Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email security issues to: security@textilehome.com
- Include detailed steps to reproduce
- Allow time for fix before public disclosure

### Security Guidelines
- All API endpoints must have rate limiting
- Validate and sanitize user inputs
- Use HTTPS in production
- Follow OWASP security guidelines
- Test against common attacks (XSS, SQL injection, CSRF)

## 📝 Pull Request Process

### Before Submitting
1. Ensure code follows style guidelines
2. Run all tests and ensure they pass
3. Update documentation if needed
4. Test security features
5. Verify no sensitive data is committed

### Pull Request Checklist
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Security features tested
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No sensitive data in commits

### Review Process
1. Automated CI/CD checks must pass
2. Security scan must pass
3. At least one maintainer review required
4. Address all feedback before merge

## 🚀 Deployment

### Development Deployment
- All changes are automatically tested in CI
- Development environment updates on merge to `develop` branch

### Production Deployment
- Only maintainers can deploy to production
- Requires passing all security checks
- Database migrations run automatically
- Rollback procedures are available

## 🐛 Issue Reporting

### Bug Reports
Include the following information:
- Environment (OS, Node.js version)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Security implications (if any)

### Feature Requests
- Describe the use case
- Explain expected behavior
- Consider security implications
- Provide implementation suggestions

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn
- Maintain professional communication

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Email: Security issues and private matters

## 📚 Resources

### Documentation
- [README.md](README.md) - Project overview and setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [replit.md](replit.md) - Technical architecture

### Tools and Technologies
- React + TypeScript (Frontend)
- Express.js (Backend)
- PostgreSQL + Drizzle ORM (Database)
- Tailwind CSS (Styling)
- Comprehensive security middleware

## 🏆 Recognition

Contributors will be:
- Listed in the project contributors
- Acknowledged in release notes
- Invited to maintainer discussions (for regular contributors)

## 📞 Getting Help

If you need help:
1. Check existing documentation
2. Search GitHub issues
3. Create a new issue with detailed information
4. Contact maintainers for urgent matters

Thank you for contributing to TextileHome!