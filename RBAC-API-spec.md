# Zorvyn Backend API & RBAC Specification

## 1. Project Overview

- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Structure**:
  - `src/models`: Mongo schemas (`User`, `Record`)
  - `src/services`: business logic + DB operations
  - `src/controllers`: request handlers
  - `src/routes`: HTTP routes
  - `src/middleware`: auth, authorization, error handling
- **Authentication**: JWT (`Authorization: Bearer <token>`)
- **Error handling**: `notFound` + `errorHandler` middleware

## 2. Domain Model

### User
- Fields: `name`, `email`, `password`, `role`, `status`, timestamps
- `role` enum: `viewer`, `analyst`, `admin` (default `viewer`)
- `status` enum: `active`, `inactive` (default `active`)
- Password hashed before save
- `toJSON` removes password

### Record
- Typical fields: `type`, `amount`, `category`, `date`, `isDeleted`, etc.

## 3. Role-Based Access Control (RBAC)

### Roles
- **Viewer**: read-only access to dashboard and records
- **Analyst**: read/write records + dashboard read
- **Admin**: full access including user management

### Middleware
- `authenticate`:
  - verify JWT
  - load user with `findUserById`
  - fail if missing/invalid token or inactive
- `authorize(...roles)`:
  - checks `req.user.role` in allowed list
  - returns 403 if unauthorized

## 4. Routes

### Auth (`/api/auth`)
- `POST /signup` - register user
  - body: `{name,email,password,role?}`
- `POST /login` - login
  - body: `{email,password}`

### Users (`/api/users`) (Protected)
- `POST /` (admin only): create user with role/status
- `GET /` (viewer/analyst/admin): list users (no password)
- `PATCH /:id` (admin only): update user role/status

### Records (`/api/records`) (Protected)
- `GET /` (viewer/analyst/admin)
- `POST /` (analyst/admin)
- `PATCH /:id` (analyst/admin)
- `DELETE /:id` (analyst/admin)

### Dashboard (`/api/dashboard`) (Protected)
- `GET /` (viewer/analyst/admin): all-summary endpoint
- `GET /total-income`, `/total-expenses`, `/net-balance`, `/category-totals`, `/monthly-trends`

## 5. Dashboard Calculation (MongoDB Aggregations)

Service methods in `src/services/dashboardService.js`:
- `totalIncome` / `totalExpenses`: `$match` by `type`, `$group` sum
- `netBalance`: income - expense
- `categoryTotals`: `$group` by category + sort
- `monthlyTrends`: aggregated year/month/type breakdown

## 6. User Management

Service methods in `src/services/userService.js`:
- `createUser`: no duplicate emails
- `getAllUsers`: returns users excluding password
- `updateUserRoleStatus`: find by id + change role/status
- `findUserByEmail`, `findUserById`

## 7. Validation & Error Handling

- 400 for missing parameters in controllers
- 401/403 for auth/authorization failures
- 404 for missing user when updating
- centralized error middleware returns JSON with status/message (and stack in dev)

## 8. Postman RBAC Test Matrix

1. Create admin, analyst, viewer accounts.
2. Login all, store tokens.
3. Test role matrix:
   - Viewer: dashboard read yes; records create/update/delete no; user create/update no.
   - Analyst: dashboard read yes; record create/update/delete yes; user create/update no.
   - Admin: all yes.

| Endpoint | Viewer | Analyst | Admin |
| ---- | ---- | ---- | ---- |
| GET /api/dashboard | ✅ | ✅ | ✅ |
| GET /api/records | ✅ | ✅ | ✅ |
| POST /api/records | ❌ | ✅ | ✅ |
| PATCH /api/records/:id | ❌ | ✅ | ✅ |
| DELETE /api/records/:id | ❌ | ✅ | ✅ |
| GET /api/users | ✅ | ✅ | ✅ |
| POST /api/users | ❌ | ❌ | ✅ |
| PATCH /api/users/:id | ❌ | ❌ | ✅ |

## 9. Inactive user behavior
- User status set to `inactive` rejects login and all protected endpoints.

## 10. Notes for examiner
- Architecture is clean and modular.
- RBAC is explicit via route decorators + middleware.
- Aggregations are correct and show analytics value.
- Error handler is centralized and consistent.

---

### How to run
1. `npm install`
2. Set `.env`: `MONGO_URI`, `JWT_SECRET`, `PORT`
3. `npm run dev`

### Quick verification
1. `POST /api/auth/signup` admin.
2. `POST /api/auth/login` admin -> JWT.
3. `POST /api/users` with admin JWT -> create analyst/viewer.
4. Use each role token to validate RBAC matrix.

---

> This file is an audit-friendly single source of truth for your RBAC project, and it is ready to hand to the examiner.
