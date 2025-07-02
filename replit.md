# TextileHome E-commerce Application

## Overview

TextileHome is a modern e-commerce application built for selling premium textiles including bedsheets, pillow covers, and table covers. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM for database operations. The UI is built with shadcn/ui components and styled with Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Client-side session ID stored in localStorage

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Tables**: Products and cart items with foreign key relationships
- **Development Storage**: In-memory storage implementation for development
- **Connection**: Neon serverless database connection

## Key Components

### Product Management
- Product catalog with categories (bedsheets, pillow-covers, table-covers)
- Product search functionality
- Featured products display
- Category-based filtering and sorting
- Product details with image gallery support

### Shopping Cart
- Session-based cart management
- Add/remove/update cart items
- Real-time cart synchronization
- Cart persistence across browser sessions

### User Interface
- Responsive design with mobile-first approach
- Modal-based shopping cart
- Search modal with real-time results
- Navigation with active link highlighting
- Toast notifications for user feedback

### API Endpoints
- GET `/api/products` - All products
- GET `/api/products/featured` - Featured products
- GET `/api/products/category/:category` - Products by category
- GET `/api/products/search` - Product search
- GET `/api/cart` - Cart items
- POST `/api/cart` - Add to cart
- PUT `/api/cart/:id` - Update cart item
- DELETE `/api/cart/:id` - Remove from cart

## Data Flow

1. **Product Display**: Frontend fetches products from API endpoints using TanStack Query
2. **Cart Operations**: Cart actions trigger API calls with session ID headers
3. **State Management**: TanStack Query manages caching and synchronization
4. **User Feedback**: Toast notifications provide immediate feedback for user actions
5. **Routing**: Wouter handles client-side navigation without page reloads

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM)
- Radix UI components for accessible UI primitives
- TanStack Query for server state management
- Wouter for routing
- React Hook Form for form handling
- Zod for schema validation
- Date-fns for date manipulation
- Lucide React for icons

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- Neon serverless for PostgreSQL connection
- Zod for data validation

### Development Tools
- Vite for build tooling
- TypeScript for type safety
- Tailwind CSS for styling
- ESBuild for backend bundling

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- TSX for backend development with auto-restart
- Environment variables for database configuration

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single process serves both API and static files

### Database
- Drizzle migrations in `./migrations` directory
- Schema defined in `shared/schema.ts`
- Push schema changes with `npm run db:push`

## Changelog
```
Changelog:
- July 02, 2025. Initial setup with in-memory storage
- July 02, 2025. Added PostgreSQL database with Drizzle ORM integration
- July 02, 2025. Migrated from in-memory storage to persistent database storage
- July 02, 2025. Added security middleware (Helmet, rate limiting)
- July 02, 2025. Seeded database with 20 sample products across 3 categories
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```