ZORVYN Backend API Documentation

Overview

This API provides a financial record management system with role-based access control (RBAC). It supports user authentication, record management, and dashboard analytics.This API is deployed and publicly accessible via the production URL.

Base URLs:
- Local: `http://localhost:5000/api`
- Production (Render): `https://finance-data-processing-and-access-se7a.onrender.com/api`

Authentication: JWT Bearer token required for protected routes

Authentication

POST /auth/signup
Register a new user account.

Request Body:
```json
{
  "name": "Alex Thompson",
  "email": "alex.thompson@gmail.com",
  "password": "MySecurePass123!"
}
```

Response (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Alex Thompson",
    "email": "alex.thompson@gmail.com",
    "role": "viewer",
    "status": "active"
  }
}
```

POST /auth/login
Authenticate user and receive JWT token.

Request Body:
```json
{
  "email": "alex.thompson@gmail.com",
  "password": "MySecurePass123!"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Alex Thompson",
    "email": "alex.thompson@gmail.com",
    "role": "viewer",
    "status": "active"
  }
}
```

Users Management

POST /users
Create a new user (Admin only).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.admin_signature
```

Request Body:
```json
{
  "name": "Sarah Martinez",
  "email": "sarah.martinez@company.com",
  "password": "AnalystPass456",
  "role": "analyst"
}
```

Response (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f191e810c19729de860ea",
    "name": "Sarah Martinez",
    "email": "sarah.martinez@company.com",
    "role": "analyst",
    "status": "active"
  }
}
```

GET /users
List all users (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Alex Thompson",
      "email": "alex.thompson@gmail.com",
      "role": "viewer",
      "status": "active"
    },
    {
      "id": "507f191e810c19729de860ea",
      "name": "Sarah Martinez",
      "email": "sarah.martinez@company.com",
      "role": "analyst",
      "status": "active"
    }
  ]
}
```

PATCH /users/:id
Update user role/status (Admin only).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.admin_signature
```

Request Body:
```json
{
  "role": "admin",
  "status": "inactive"
}
```

Response (200):
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "507f191e810c19729de860ea",
    "name": "Sarah Martinez",
    "email": "sarah.martinez@company.com",
    "role": "admin",
    "status": "inactive"
  }
}
```

Records Management

GET /records
Get all records (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Query Parameters:
- `type` (optional): Filter by record type ('income' or 'expense')
- `category` (optional): Filter by category
- `startDate` (optional): Filter records from this date (YYYY-MM-DD)
- `endDate` (optional): Filter records to this date (YYYY-MM-DD)

Response (200):
```json
{
  "records": [
    {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "type": "income",
      "amount": 5000,
      "category": "salary",
      "date": "2024-01-15",
      "note": "Monthly salary",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

POST /records
Create a new record (Admin and Analyst only).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxOTE4MTBjMTk3MjlkZTg2MGVhIiwicm9sZSI6ImFuYWx5c3QiLCJpYXQiOjE2ODMwMjc2MDAsImV4cCI6MTY4MzAzMTIwMH0.analyst_signature
```

Request Body:
```json
{
  "type": "expense",
  "amount": 150,
  "category": "food",
  "date": "2024-01-20",
  "note": "Lunch at restaurant"
}
```

Response (201):
```json
{
  "message": "Record created successfully",
  "record": {
    "id": "64a1b2c3d4e5f6789abcdef1",
    "type": "expense",
    "amount": 150,
    "category": "food",
    "date": "2024-01-20",
    "note": "Lunch at restaurant",
    "createdBy": "507f191e810c19729de860ea",
    "createdAt": "2024-01-20T12:00:00.000Z",
    "updatedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

PATCH /records/:id
Update a record (Admin and Analyst only).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxOTE4MTBjMTk3MjlkZTg2MGVhIiwicm9sZSI6ImFuYWx5c3QiLCJpYXQiOjE2ODMwMjc2MDAsImV4cCI6MTY4MzAzMTIwMH0.analyst_signature
```

Request Body:
```json
{
  "amount": 200,
  "note": "Updated lunch expense"
}
```

Response (200):
```json
{
  "message": "Record updated successfully",
  "record": {
    "id": "64a1b2c3d4e5f6789abcdef1",
    "type": "expense",
    "amount": 200,
    "category": "food",
    "date": "2024-01-20",
    "note": "Updated lunch expense",
    "createdBy": "507f191e810c19729de860ea",
    "updatedAt": "2024-01-20T13:00:00.000Z"
  }
}
```

DELETE /records/:id
Soft delete a record (Admin and Analyst only).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxOTE4MTBjMTk3MjlkZTg2MGVhIiwicm9sZSI6ImFuYWx5c3QiLCJpYXQiOjE2ODMwMjc2MDAsImV4cCI6MTY4MzAzMTIwMH0.analyst_signature
```

Response (200):
```json
{
  "message": "Record deleted successfully"
}
```

Dashboard Analytics

GET /dashboard
Get comprehensive dashboard data (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "totalIncome": 15000,
  "totalExpenses": 8500,
  "netBalance": 6500,
  "categoryTotals": {
    "salary": 15000,
    "food": 1200,
    "transport": 800,
    "utilities": 2500
  },
  "monthlyTrends": [
    {
      "month": "2024-01",
      "income": 15000,
      "expenses": 8500,
      "net": 6500
    }
  ]
}
```

GET /dashboard/total-income
Get total income (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "totalIncome": 15000
}
```

GET /dashboard/total-expenses
Get total expenses (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "totalExpenses": 8500
}
```

GET /dashboard/net-balance
Get net balance (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "netBalance": 6500
}
```

GET /dashboard/category-totals
Get expenses by category (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "categoryTotals": {
    "food": 1200,
    "transport": 800,
    "utilities": 2500
  }
}
```

GET /dashboard/monthly-trends
Get monthly income/expense trends (All authenticated users).

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY4MzAyNzYwMCwiZXhwIjoxNjgzMDMxMjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Response (200):
```json
{
  "monthlyTrends": [
    {
      "month": "2024-01",
      "income": 15000,
      "expenses": 8500,
      "net": 6500
    },
    {
      "month": "2024-02",
      "income": 16000,
      "expenses": 9200,
      "net": 6800
    }
  ]
}
```

Error Responses

400 Bad Request
```json
{
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

401 Unauthorized
```json
{
  "message": "Access token is required"
}
```
```json
{
  "message": "Invalid token"
}
```
```json
{
  "message": "User account is inactive"
}
```

403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

404 Not Found
```json
{
  "message": "Resource not found"
}
```

500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

Role-Based Access Control

| Endpoint | Method | Viewer | Analyst | Admin |
|----------|--------|--------|---------|-------|
| /auth/ | POST | ✓ | ✓ | ✓ |
| /users | GET | ✓ | ✓ | ✓ |
| /users | POST | ✗ | ✗ | ✓ |
| /users/:id | PATCH | ✗ | ✗ | ✓ |
| /records | GET | ✓ | ✓ | ✓ |
| /records | POST | ✗ | ✓ | ✓ |
| /records/:id | PATCH | ✗ | ✓ | ✓ |
| /records/:id | DELETE | ✗ | ✓ | ✓ |
| /dashboard/ | GET | ✓ | ✓ | ✓ |

Data Models

User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "viewer|analyst|admin",
  "status": "active|inactive",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

Record
```json
{
  "id": "string",
  "type": "income|expense",
  "amount": "number",
  "category": "string",
  "date": "YYYY-MM-DD",
  "note": "string",
  "isDeleted": "boolean",
  "createdBy": "string (user id)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

Getting Started

1. Start the server: `npm run dev`
2. The API will be available at `http://localhost:3000`
3. Use tools like Postman or curl to test the endpoints
4. First, create an admin user via signup, then use the token for admin operations
