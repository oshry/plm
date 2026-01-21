# Fashion PLM System

A full-stack Product Lifecycle Management system for the fashion industry, built with React, Node.js, and MySQL.

## 🚀 Current Status

**✅ Backend API Complete** - All endpoints implemented and tested
- Full CRUD operations for garments, materials, attributes, suppliers
- Lifecycle state management with validation
- Business rules enforcement (attribute incompatibilities)
- Supplier workflow (offers, samples, status transitions)
- Design evolution tracking (base_design_id)

**✅ Frontend Complete** - React with Tailwind CSS

**📊 Database** - Schema loaded with seed data

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express, TypeScript, MySQL2
- **Database**: MySQL 8 (raw SQL with connection pooling)
- **Package Manager**: pnpm (workspace monorepo)
- **Containerization**: Docker & Docker Compose

### Project Structure
```
plm/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── http/           # HTTP layer
│   │   │   ├── routes/     # API route definitions
│   │   │   ├── controllers/# Request handlers (empty for now)
│   │   │   └── middleware/ # HTTP middleware (empty for now)
│   │   ├── application/    # Application layer
│   │   │   ├── usecases/   # Business logic orchestration
│   │   │   └── errors/     # Application errors (empty for now)
│   │   ├── domain/         # Domain layer
│   │   │   ├── rules/      # Business rules (empty for now)
│   │   │   └── types/      # Domain types and enums
│   │   ├── infra/          # Infrastructure layer
│   │   │   ├── db/         # Database connection and queries
│   │   │   │   ├── pool.ts # MySQL2 connection pool
│   │   │   │   └── sql/    # SQL schema and migrations
│   │   │   └── repositories/# Data access (empty for now)
│   │   ├── config/         # Configuration management
│   │   ├── utils/          # Utilities (logger, etc.)
│   │   └── index.ts        # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # React entry point
│   │   └── index.css      # Tailwind CSS
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Multi-container orchestration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose**

### Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd plm
   pnpm install
   ```

2. **Start MySQL (Docker)**
   ```bash
   docker-compose up -d mysql
   ```

3. **Initialize database**
   ```bash
   # Load schema
   docker exec -i myapp-db mysql -u plm_user -pplm_password fashion_plm < backend/src/db/init.sql
   
   # Load seed data
   docker exec -i myapp-db mysql -u plm_user -pplm_password fashion_plm < backend/src/db/seed.sql
   ```

4. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

5. **Start backend**
   ```bash
   cd backend
   pnpm dev
   ```

6. **Start frontend**
   ```bash
   cd frontend
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

### Testing the API

```bash
# List garments
curl http://localhost:3000/api/garments | jq

# Get garment with materials and attributes
curl http://localhost:3000/api/garments/1 | jq

# See API_TESTING.md for complete examples
```

### Development Without Docker

If you prefer to run services locally:

1. **Start MySQL** (using Docker or local installation)
   ```bash
   docker run -d \
     --name plm-mysql \
     -e MYSQL_ROOT_PASSWORD=rootpassword \
     -e MYSQL_DATABASE=fashion_plm \
     -e MYSQL_USER=plm_user \
     -e MYSQL_PASSWORD=plm_password \
     -p 3306:3306 \
     mysql:8.0
   ```

2. **Start Backend**
   ```bash
   cd backend
   cp .env.example .env
   pnpm install
   pnpm dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

## 🗄️ Database

### Connection Details
- **Host**: localhost
- **Port**: 3306
- **Database**: fashion_plm
- **Username**: plm_user
- **Password**: plm_password

### Access MySQL CLI
```bash
docker exec -it plm-mysql mysql -u plm_user -pplm_password fashion_plm
```

### Database Schema
The database includes 8 tables with proper relationships:
- `garments` - Product information and lifecycle state
- `materials` - Available materials (cotton, denim, etc.)
- `attributes` - Product attributes (sleeve type, category, etc.)
- `suppliers` - Supplier information
- `garment_materials` - Material composition with percentages
- `garment_attributes` - Garment attribute assignments
- `garment_suppliers` - Supplier relationships and status
- `attribute_incompatibilities` - Business rules

## 📋 Key Features

### 1. Garment Management
- Full CRUD operations
- Material composition tracking with percentages
- Attribute management with incompatibility validation
- Lifecycle state progression

### 2. Design Evolution
- Parent-child relationships via `base_design_id`
- Change notes for variations
- Track design iterations

### 3. Supplier Management
- Multiple suppliers per garment
- Offer tracking
- Sample set management with status
- Supplier state progression (OFFERED → SAMPLING → APPROVED → IN_STORE)

### 4. Lifecycle States
- CONCEPT → DESIGN → SAMPLE → APPROVED → MASS_PRODUCTION
- State transition validation
- Delete protection for MASS_PRODUCTION garments

### 5. Business Rules
- Incompatible attribute validation (e.g., nightwear ↔ running outfit)
- Material percentage validation
- Production garments cannot be deleted

## 🛠️ Development Commands

### Root Level
```bash
pnpm dev              # Start both frontend and backend
pnpm build            # Build both projects
pnpm docker:up        # Start Docker containers
pnpm docker:down      # Stop Docker containers
pnpm docker:logs      # View container logs
```

### Backend
```bash
cd backend
pnpm dev              # Start dev server with hot reload
pnpm build            # Compile TypeScript
```

### Frontend
```bash
cd frontend
pnpm dev              # Start Vite dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=plm_user
DB_PASSWORD=plm_password
DB_DATABASE=fashion_plm
```

### Frontend
```env
VITE_API_URL=http://localhost:3000
```

## 📝 API Endpoints

Complete API documentation available in `API_TESTING.md`

### Garments
- `GET /api/garments` - List all garments
- `GET /api/garments/:id` - Get garment with materials and attributes
- `POST /api/garments` - Create new garment
- `PUT /api/garments/:id` - Update garment
- `DELETE /api/garments/:id` - Delete garment (protected)
- `GET /api/garments/:id/variations` - Get design variations

### Materials
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create material
- `POST /api/garments/:id/materials` - Add material to garment

### Attributes
- `GET /api/attributes` - List all attributes
- `POST /api/attributes` - Create attribute
- `POST /api/attributes/validate` - Validate attribute compatibility
- `POST /api/garments/:id/attributes` - Add attribute to garment

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/garment-suppliers/:garmentId` - Get suppliers for garment

## 🎯 Architectural Decisions

### 1. MySQL2 with Raw SQL
- **Rationale**: Direct control over queries, better performance
- **Benefits**: No ORM overhead, explicit query optimization
- **Implementation**: Connection pooling with cluster support

### 2. React with Tailwind CSS
- **Why**: Modern, responsive UI with utility-first CSS
- **Benefits**: Fast development, consistent design, mobile-first
- **Components**: Modular component structure (List, Detail, Form)

### 3. Service Layer Architecture
- **Why**: Separation of concerns, testability
- **Structure**: Routes → Services → Database
- **Benefit**: Business logic isolated from HTTP layer
- **Pattern**: Each domain (garments, materials, etc.) has its own service

### 4. Business Rules in Database
- **Why**: Data integrity at the source
- **Implementation**: `attribute_incompatibilities` table
- **Validation**: Checked before INSERT/UPDATE operations
- **Benefit**: Rules enforced regardless of API client

### 5. Pino for Structured Logging
- **Why**: Fast, structured JSON logging
- **Features**: Request logging, error tracking, performance monitoring

## � Documentation

- `README.md` - This file
- `API_TESTING.md` - Complete API documentation with curl examples
- `PROJECT_SUMMARY.md` - Detailed project overview
- `FRONTEND_GUIDE.md` - Frontend features and usage guide

## 📦 Docker Services

### MySQL Service
- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: Persistent data storage
- **Health Check**: Automatic startup verification

**Note**: Backend and frontend run locally for development (not in Docker) for better hot reload and debugging experience.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different ports in docker-compose.yml
```

### Database Connection Failed
```bash
# Check MySQL is running
docker ps | grep plm-mysql

# View MySQL logs
docker logs plm-mysql

# Restart MySQL
docker-compose restart mysql
```

### Dependencies Not Installing
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
pnpm install
```

### Docker Build Issues
```bash
# Rebuild containers from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📄 License

MIT

## 👥 Contributing

This is a technical assessment project. For production use, consider:
- Authentication/Authorization
- Input validation and sanitization
- Rate limiting
- API documentation (Swagger/OpenAPI)
- Unit and integration tests
- CI/CD pipeline
- Error monitoring (Sentry, etc.)
- Performance monitoring
