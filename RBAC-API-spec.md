ZORVYN BACKEND API AND RBAC SPECIFICATION

1.  Project Overview

Backend: Node.js + Express + MongoDB (Mongoose)

Structure: 
- src/models: Mongo schemas (User, Record)
- src/services:business logic and database operations
- src/controllers: requesthandlers 
- src/routes: HTTP routes
- src/middleware: authentication, authorization, error handling

Authentication: JWT using Authorization header (Bearer token)

Error Handling: centralized middleware (notFound and errorHandler)

2.  Domain Model

User - Fields: name, email, password, role, status, timestamps 
- Role values: viewer, analyst, admin (default: viewer)
- Status values: active, inactive (default: active)
- Password is hashed before saving - Password is excluded from API responses

Record
- Fields: type, amount, category, date, note, isDeleted,createdBy, timestamps

3.  Role-Based Access Control (RBAC)

Viewer: read-only access
Analyst: read + write records
Admin: full access

Middleware: 
- authenticate: verifies JWT and user
- authorize: checks role permissions

4. API Routes

Auth (/api/auth)
- POST /signup
- POST /login

Users (/api/users) (Authenticated)
- POST / (admin only): create user
- GET / (all roles): list users
- PATCH /:id (admin only): update user role/status

Records (/api/records) (Authenticated)
- GET / (all roles): view records
- POST / (admin, analyst): create record
- PATCH /:id (admin, analyst): update record
- DELETE /:id (admin, analyst): delete record
Dashboard (/api/dashboard) (Authenticated)
- GET /
- GET /total-income
- GET /total-expenses
- GET /net-balance
- GET /category-totals
- GET /monthly-trends

5. Dashboard Calculations

Uses MongoDB aggregation:
- total income
- total expenses
- net balance
- category totals
- monthly trends

6. Validation and Error Handling

- 400 Bad Request (validation missing fields)
- 401 Unauthorized (token missing/invalid/inactive user)
- 403 Forbidden (role not allowed)
- 404 Not Found (resource not found)

7. RBAC Capability Matrix

| Role    | Dashboard | Records (Read) | Records (Write) | User Management |
| ------- | --------- | -------------- | --------------- | --------------- |
| Viewer  | Yes       | Yes            | No              | No              |
| Analyst | Yes       | Yes            | Yes             | No              |
| Admin   | Yes       | Yes            | Yes             | Yes             |

Note:
- Viewer has strictly read-only access.
- Analyst can manage financial records but cannot manage users.
- Admin has full system control including user and role management.

8. How to Run

1. npm install
2. configure .env with MONGO_URI, JWT_SECRET, PORT
3. npm run dev

9. Testing Flow (Postman)

- Sign up admin and login for admin token.
- Create analyst and viewer using admin token.
- Login as each user and store tokens.
- Exercise routes and verify responses as per RBAC matrix.

10. Notes

- RBAC is enforced at route layer via middleware.
- Dashboard is produced with aggregation queries in services.
- Inactive users are blocked from login and route access.


11. Deployment

This backend is deployed using Render.  
Environment variables used:
- MONGO_URI  
- JWT_SECRET  
- PORT  

---

12. Health Check

GET https://finance-data-processing-and-access-se7a.onrender.com/

Response:
{
  "message": "Finance Data Processing and Access Control System"
}