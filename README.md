# TextileHome E-commerce Platform

A modern, secure e-commerce website for premium textiles including bedsheets, pillow covers, and table covers. Built with React, TypeScript, and comprehensive security features.

## 🚀 Features

- **Modern Frontend**: React 18 with TypeScript and Tailwind CSS
- **Secure Backend**: Express.js with comprehensive 8-layer security protection
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations
- **Responsive Design**: Mobile-first approach with shadcn/ui components
- **Real-time Cart**: Persistent shopping cart with session management
- **Advanced Search**: Product search with category filtering
- **Security Features**: Bot protection, rate limiting, SQL injection prevention, XSS protection

## 🛡️ Security Features

- **Bot Detection**: Automatic blocking of automated scrapers and malicious bots
- **Progressive Rate Limiting**: Multi-tier rate limiting (30-500 requests/min based on endpoint)
- **Attack Prevention**: SQL injection, XSS, and CSRF protection
- **IP Blocking**: Intelligent temporary and permanent IP banning
- **Honeypot Traps**: Fake endpoints to catch automated attacks
- **Request Validation**: Content-type, size, and origin verification
- **Security Monitoring**: Real-time threat tracking endpoint

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- TanStack Query for state management
- Wouter for routing
- React Hook Form with Zod validation

### Backend
- Node.js with Express.js
- PostgreSQL database
- Drizzle ORM
- Comprehensive security middleware
- Session-based cart management

### Security
- Helmet for security headers
- express-rate-limit for rate limiting
- Custom middleware for bot detection
- SQL injection and XSS protection
- CSRF protection

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/textilehome.git
   cd textilehome
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=5000
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t textilehome .
docker run -p 5000:5000 textilehome
```

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── security.ts        # Security middleware
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── README.md
```

## 🔒 Security Configuration

### Development vs Production
- **Development**: More lenient rate limits for testing
- **Production**: Strict security with aggressive blocking

### Rate Limits
- **Strict**: 30-100 requests/minute
- **General**: 200-500 requests/15 minutes
- **Cart Operations**: 15-50 requests/5 minutes
- **Search**: 10-30 requests/minute

### Monitoring
Access security status at `/api/security/status` to view:
- Blocked IP addresses
- Suspicious activity
- Recent security events

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Security
- `GET /api/security/status` - Security monitoring (admin only)

## 🧪 Testing

```bash
# Run tests
npm test

# Run security tests
npm run test:security

# Run integration tests
npm run test:integration
```

## 📝 Development

### Database Operations
```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate

# Seed database
npm run db:seed
```

### Code Quality
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🚀 CI/CD Pipeline

The project includes GitHub Actions workflows for:
- **Build & Test**: Automated testing on every push
- **Security Scanning**: Dependency and code security checks
- **Deployment**: Automatic deployment to production
- **Database Migrations**: Safe database updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@textilehome.com or create an issue in the GitHub repository.

---

Built with ❤️ for secure, modern e-commerce