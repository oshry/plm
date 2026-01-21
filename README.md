# Fashion PLM System

A full-stack Product Lifecycle Management system for the fashion industry, built with React, Node.js, and MySQL.

## 🚀 Current Status

**✅ Backend API Complete** - All endpoints implemented and tested
- Full CRUD operations for garments, materials, attributes, suppliers
- Lifecycle state management with validation
- Business rules enforcement (attribute incompatibilities)
- Supplier workflow (offers, samples, status transitions)
- Design evolution tracking (base_design_id)

**🔧 Frontend** - Basic setup ready for development

**📊 Database** - Schema loaded with seed data

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript, Vite
- **Backend**: Node.js with Express, TypeScript, MySQL2
- **Database**: MySQL 8 (raw SQL with connection pooling)
- **Package Manager**: pnpm (workspace monorepo)
- **Containerization**: Docker & Docker Compose

### Project Structure
```
plm/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── entities/       # TypeORM entities (to be created)
│   │   ├── migrations/     # Database migrations
│   │   ├── utils/          # Utilities (logger, etc.)
│   │   ├── data-source.ts  # TypeORM data source
│   │   └── index.ts        # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── App.tsx         # Main application component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
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

4. **Start backend (local development)**
   ```bash
   cd backend
   pnpm dev
   ```

5. **Access the application**
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health
   - API overview: http://localhost:3000/api

6. **Test the API**
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

### TypeORM Configuration
- **Synchronize**: Enabled in development (auto-creates tables)
- **Logging**: Enabled in development
- **Entities**: `backend/src/entities/**/*.ts`
- **Migrations**: `backend/src/migrations/**/*.ts`

## 📋 Key Features (To Be Implemented)

### 1. Garment Management
- CRUD operations for garments
- Material composition tracking (denim, lycra, cotton, etc.)
- Attribute management (sleeve type, neckline, category, etc.)

### 2. Design Evolution
- Parent-child relationships for garment variations
- Version history tracking
- Design iteration management

### 3. Supplier Management
- Multiple suppliers per garment
- Offer tracking and comparison
- Sample set management
- Supplier state progression

### 4. Lifecycle States
- Concept → Design → Sampling → Production → In Stores
- State transition validation
- Audit trail for state changes

### 5. Business Rules
- Incompatible attribute validation (e.g., nightwear ≠ running outfit)
- Production garments cannot be deleted (soft delete)
- State transition constraints

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
pnpm start            # Run compiled code
pnpm typeorm          # Run TypeORM CLI commands
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

## 📝 API Endpoints (To Be Implemented)

### Garments
- `GET /api/garments` - List all garments
- `GET /api/garments/:id` - Get garment details
- `POST /api/garments` - Create new garment
- `PUT /api/garments/:id` - Update garment
- `DELETE /api/garments/:id` - Delete/soft-delete garment

### Materials
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create material

### Attributes
- `GET /api/attributes` - List all attributes
- `POST /api/attributes` - Create attribute

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/garments/:id/suppliers` - Get suppliers for garment
- `POST /api/garments/:id/suppliers` - Add supplier to garment

## 🎯 Architectural Decisions

### 1. TypeORM with MySQL
- **Rationale**: Complex relational data (garments, materials, suppliers, attributes) benefits from RDBMS
- **Benefits**: Strong typing, migration support, relationship management
- **Trade-offs**: More setup than NoSQL, but better for data integrity

### 2. Pino for Logging
- **Rationale**: High-performance JSON logging with minimal overhead
- **Benefits**: Structured logs, production-ready, excellent performance

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

### 5. Docker for MySQL Only
- **Why**: Backend runs locally for faster development
- **Benefit**: Hot reload, easier debugging, no volume mount issues
- **Configuration**: MySQL on port 3307 to avoid conflicts with local installations

### 6. Pino for Structured Logging
- **Why**: Fast, structured JSON logging
- **Benefit**: Better than console.log for production
- **Features**: Request logging, error tracking, performance monitoring

## 🔄 Next Steps

1. **Define Database Schema**
   - Create tables for Garments, Materials, Attributes, Suppliers
   - Define relationships and constraints
   - Set up migrations

2. **Implement Business Logic**
   - Lifecycle state machine
   - Business rule validation engine
   - Design evolution tracking

3. **Build API Endpoints**
   - RESTful CRUD operations
   - Complex queries (filtering, sorting, pagination)
   - Error handling and validation

4. **Develop Frontend**
   - Garment management UI
   - Supplier workflow interface
   - State visualization dashboard

## 📦 Docker Services

### MySQL Service
- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: Persistent data storage
- **Health Check**: Automatic startup verification

### Backend Service
- **Build**: ./backend/Dockerfile
- **Port**: 3000
- **Hot Reload**: Enabled via volume mount
- **Depends On**: MySQL (waits for health check)

### Frontend Service
- **Build**: ./frontend/Dockerfile
- **Port**: 5173
- **Hot Reload**: Enabled via volume mount
- **Depends On**: Backend

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
