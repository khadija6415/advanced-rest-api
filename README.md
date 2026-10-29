# Advanced REST API

A complete REST API built with **Express.js** and **Modular MVC architecture**, featuring JWT authentication, Category CRUD and Course CRUD.

**Author:** Khadija Wazeer · **Roll No:** SU92-BSCSM-F24-691

## Features

- Authentication with JWT and bcrypt password hashing
- Role-based access (user and admin)
- Category CRUD and Course CRUD (courses belong to a category)
- Input validation with clear 400 errors
- Search, filtering, sorting and pagination
- Invalid ID and unknown URL return 404
- Centralized error handling and a consistent JSON response format
- Security: Helmet, CORS, rate limiting
- Responsive API documentation page at `/`

## Tech Stack

Node.js, Express.js, MongoDB (Mongoose), JSON Web Token, bcryptjs, express-validator, Helmet, Morgan.

## Project Structure

```
advanced-rest-api/
├── docs/
│   ├── screenshots/        # Postman evidence
│   └── Postman-Evidence.docx
├── src/
│   ├── config/             # database connection
│   ├── controllers/        # request handling logic
│   ├── middlewares/        # auth, validation, errors, 404
│   ├── models/             # Mongoose schemas
│   ├── public/             # responsive documentation page
│   ├── routes/             # API routes
│   ├── utils/              # helpers
│   ├── validators/         # input validation rules
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

## Getting Started

### 1. Install

```bash
git clone https://github.com/khadija6415/advanced-rest-api.git
cd advanced-rest-api
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your own values:

```
PORT=5050
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
ADMIN_SECRET_KEY=your_admin_secret_key_here
```

### 3. Run

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Open `http://localhost:5050` for the documentation page.

## API Endpoints

Base URL: `http://localhost:5050/api`

Protected routes need the header `Authorization: Bearer <token>`.

### Auth (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive a token |
| GET | `/me` | Private | Get the logged-in user |

### Categories (`/api/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List categories (`search`, `isActive`, `page`, `limit`) |
| GET | `/:id` | Public | Get one category |
| POST | `/` | Private | Create a category |
| PUT | `/:id` | Private | Update a category |
| DELETE | `/:id` | Admin | Delete a category (blocked if it has courses) |

### Courses (`/api/courses`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List courses (`search`, `category`, `level`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| GET | `/:id` | Public | Get one course |
| POST | `/` | Private | Create a course |
| PUT | `/:id` | Private | Update a course |
| DELETE | `/:id` | Admin | Delete a course |

## Response Format

Success:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { "category": {} }
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Email is required" }]
}
```

## Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (role not allowed) |
| 404 | Not Found (unknown route or invalid ID) |
| 409 | Conflict (duplicate value) |

## Postman Evidence

Screenshots of the required test cases are in [`docs/screenshots`](docs/screenshots):

1. Successful `/register` and `/login`
2. `POST /api/categories` with `201 Created`
3. `GET /api/categories` with `200 OK`
4. `400 Bad Request` for a missing required field
5. `404 Not Found` for an unknown route and an invalid ID