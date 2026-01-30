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
