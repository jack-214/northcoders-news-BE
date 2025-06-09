# Northcoders News API

**Deloyed link:** https://northcoders-news-be-ngc3.onrender.com

## Summary

Northcoders News is a RESTful Node.js and Express banckend for a news-style application. It supports:

- Viewing topics, articles, comments, and users.
- Posting comments, voting on articles, deleting comments.
- Advanced filtering and sorting via query parameters.

Tests have been written using Jest & Supertest, and a seeded PostgreSQL database powers the API.

## Getting Started

### Prerequisites

- Node.js $\ge$ 14
- PostgreSQL $\ge$ 12

### Setup Steps

#### 1. Clone the repo

```bash
git clone https://github.com/jack-214/northcoders-news-BE.git
cd northcodersc-news-BE
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create two `.env` files in the root of your project:

##### `.env.development`

```env
PGDATABASE=nc_news
```

##### `.env.test`

```env
PGDATABASE=nc_news_test
```

Important: Ensure `.env.\*` files are listed in your .gitignore so they are not commited to GitHub.

#### 4. Seed your local database

```bash
npm run seed
```

#### 5. Run tests

```bash
npm test
```

#### 6. Start the server

```bash
npm start
```

Server will run on `localhost: 8000` by default (or your configured port).

## Tech Stack

- **Node.js** + **Express** API
- **PostgreSQL** via `pg`
- **Jest** and **Supertest** for testing

## API Endpoints

Full documentation available at `GET /api` (served from `endpoints.js`)

## Testing

- Run `npm test` to execute the full test suite.
- Uses `beforeEach` seeds and `afterAll` closes DB connection.
- Includes tests for "happy" and "error" paths (e.g., invalid IDs, missing fields).
