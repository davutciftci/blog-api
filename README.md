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

## 📝 License

MIT

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

## Acknowledgments

- [roadmap.sh](https://roadmap.sh/backend) - Backend Developer Roadmap
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Express.js](https://expressjs.com/) - Web framework

---

⭐ Star this repo if you found it helpful!
