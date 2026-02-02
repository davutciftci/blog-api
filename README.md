# Blog API

A modern RESTful blog API built with Node.js, Express, PostgreSQL, and Prisma.

## Features (Coming Soon)

- User authentication (JWT)
- CRUD operations for posts
- Comments system
- User profiles

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Architecture

### Service Layer

Business logic is separated into service files:

- **userService.js** - User CRUD operations, password hashing
- **postService.js** - Post CRUD operations, slug generation, authorization

Services interact with Prisma ORM and are fully tested with mocked database.

### Testing Strategy

- **Unit Tests:** Utility functions (validators, formatters)
- **Service Tests:** Business logic with mocked database
- **Integration Tests:** API endpoints (coming next)

Current test coverage: **95%+** ✅

## Installation

\`\`\`bash

# Install dependencies

npm install

# Setup database

npx prisma migrate dev

# Start development server

npm run dev
\`\`\`

## Author

Your Name

## License

MIT

## Testing

This project uses Jest for unit testing.

### Run Tests

\`\`\`bash

# Run all tests

npm test

# Watch mode (auto-run on file changes)

npm run test:watch

# Coverage report

npm run test:coverage
\`\`\`

### Test Coverage

Current coverage: **100%** ✅

- Unit tests: 38 tests
- Test files: 2
- Coverage report: `coverage/lcov-report/index.html`

...

## API Endpoints

### Base URL

\`\`\`
Development: http://localhost:3000
\`\`\`

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

**Response (201):**
\`\`\`json
{
"message": "User registered successfully",
"user": {
"id": "uuid",
"email": "user@example.com",
"name": "John Doe"
},
"token": "jwt-token"
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
Content-Type: application/json

{
"title": "Updated Title",
"published": true
}
\`\`\`

#### Delete Post (Protected, Author Only)

\`\`\`http
DELETE /api/posts/:id
Authorization: Bearer <token>
\`\`\`

## Testing

### Test Coverage: **92%+** ✅

- **Unit Tests:** 38 tests (validators, formatters)
- **Service Tests:** 30 tests (user, post services)
- **Integration Tests:** 42 tests (auth, posts APIs)
- **Total:** 110 tests

### Run Tests

\`\`\`bash

# All tests

npm test

# Watch mode

npm run test:watch

# Coverage report

npm run test:coverage
\`\`\`

### Test Database

Integration tests use a separate test database configured in \`.env.test\`
