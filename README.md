# Blog API

![Tests](https://github.com/YOUR_USERNAME/blog-api/actions/workflows/test.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen)
![Node](https://img.shields.io/badge/node-18.x-green)
![License](https://img.shields.io/badge/license-MIT-blue)

> A production-ready REST API for a blog platform with authentication, posts, and comments.

[Live Demo](#) | [API Docs](#) | [Postman Collection](#)

## ✨ Features

- 🔐 **Authentication** - JWT-based auth with refresh tokens
- 📝 **Posts** - CRUD operations with slug generation
- 💬 **Comments** - Nested comments system
- 🔒 **Authorization** - Owner-based resource access
- ✅ **Validation** - Input validation with Zod
- 🧪 **Testing** - 97% test coverage (145 tests)
- 🚀 **CI/CD** - Automated testing with GitHub Actions
- 📊 **Coverage** - Coverage reporting with Codecov

## 🛠️ Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **CI/CD:** GitHub Actions

## 📦 Installation

\`\`\`bash

# Clone repository

git clone https://github.com/YOUR_USERNAME/blog-api.git
cd blog-api

# Install dependencies

npm install

# Setup environment

cp .env.example .env

# Edit .env with your configuration

# Run migrations

npx prisma migrate dev

# Start development server

npm run dev
\`\`\`

## 🧪 Testing

\`\`\`bash

# Run all tests

npm test

# Watch mode

npm run test:watch

# Coverage report

npm run test:coverage
\`\`\`

### Test Coverage: **97%** ✅

- **Unit Tests:** 44 tests (utilities, services)
- **Service Tests:** 45 tests (business logic)
- **Integration Tests:** 56 tests (API endpoints)
- **Edge Cases:** 20+ tests (error scenarios)

## 📚 API Documentation

### Authentication

#### Register

\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
"email": "user@example.com",
"password": "SecurePass123",
"name": "John Doe"
}
\`\`\`

#### Login

\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
"email": "user@example.com",
"password": "SecurePass123"
}
\`\`\`

#### Get Profile (Protected)

\`\`\`http
GET /api/auth/profile
Authorization: Bearer <token>
\`\`\`

### Posts

#### Create Post (Protected)

\`\`\`http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
"title": "My Blog Post",
"content": "This is the content...",
"published": true
}
\`\`\`

#### Get All Posts (Public)

\`\`\`http
GET /api/posts?page=1&limit=10&published=true
\`\`\`

#### Get Single Post (Public)

\`\`\`http
GET /api/posts/:id
\`\`\`

#### Update Post (Protected, Author Only)

\`\`\`http
PUT /api/posts/:id
Authorization: Bearer <token>
\`\`\`

#### Delete Post (Protected, Author Only)

\`\`\`http
DELETE /api/posts/:id
Authorization: Bearer <token>
\`\`\`

### Comments

#### Create Comment (Protected)

\`\`\`http
POST /api/posts/:postId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
"content": "Great post!"
}
\`\`\`

#### Get Post Comments (Public)

\`\`\`http
GET /api/posts/:postId/comments
\`\`\`

#### Delete Comment (Protected, Author Only)

\`\`\`http
DELETE /api/comments/:id
Authorization: Bearer <token>
\`\`\`

## 🏗️ Architecture

\`\`\`
src/
├── config/ # Database configuration
├── controllers/ # Request handlers
├── middlewares/ # Express middlewares
├── routes/ # API routes
├── services/ # Business logic
├── utils/ # Utility functions
├── app.js # Express app setup
└── server.js # Server entry point
\`\`\`

## 🔐 Security

- JWT authentication
- Password hashing (bcrypt)
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection
- CORS configuration
- Environment variables

## CI/CD

Automated testing pipeline with GitHub Actions:

- ✅ Runs on every push and pull request
- ✅ PostgreSQL test database
- ✅ Full test suite execution
- ✅ Coverage reporting
- ✅ Build verification

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed
- Docker running

### Quick Start with Docker

\`\`\`bash
# 1. Create Docker network
docker network create blog-network

# 2. Run PostgreSQL
docker run --name blog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=blog_dev \
  --network blog-network \
  -p 5432:5432 \
  -d postgres:15-alpine

# 3. Run migrations (from local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_dev" \
npx prisma migrate deploy

# 4. Build API image
docker build -t blog-api .

# 5. Run API container
docker run --name blog-api-container \
  --network blog-network \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@blog-postgres:5432/blog_dev" \
  -e JWT_SECRET="your-secret-key" \
  -e NODE_ENV="production" \
  -d blog-api

# 6. Test API
curl http://localhost:3000
\`\`\`

### Stop & Cleanup

\`\`\`bash
# Stop containers
docker stop blog-api-container blog-postgres

# Remove containers
docker rm blog-api-container blog-postgres

# Remove network
docker network rm blog-network

# Remove image
docker rmi blog-api
\`\`\`

### View Logs

\`\`\`bash
# API logs
docker logs -f blog-api-container

# PostgreSQL logs
docker logs -f blog-postgres
\`\`\`

### Development

For development, use local setup:
\`\`\`bash
npm run dev
\`\`\`

For production, use Docker.

## 📝 License

MIT

## 👤 Author

**Davut Çiftçi**

- GitHub: [@davutciftci](https://github.com/davutciftci)
- LinkedIn: [@davutciftci](https://linkedin.com/in/davutciftci)


---

⭐ Star this repo if you found it helpful!
