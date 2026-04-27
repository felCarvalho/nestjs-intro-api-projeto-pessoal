# NestJS Intro - Task Management and Authentication System

[🇧🇷 Versão em Português](./README.md) | [🇺🇸 English Version](./README.en.md)

This is a robust backend built with **NestJS**, using **MikroORM** for data persistence in **PostgreSQL**. The project follows Clean Architecture and DDD (Domain-Driven Design) principles.

## 🚀 Project Structure

The source code is organized within the `src/` directory, divided into functional modules:

### 🔐 Authentication (`src/authentication`)
Responsible for the entire security and identity layer:
- **Strategies:** Implements local login (email/password) and JWT authentication (Access and Refresh Tokens).
- **Entities:** Manages credentials, password hashes, and token states.
- **Security:** Uses Guards to protect routes and Builders for secure construction of security entities.

### 🛡️ Authorization (`src/authorization`)
Manages access control (RBAC - Role-Based Access Control):
- Defines system permissions and roles.
- Links permissions to roles to determine what each user can access.

### 👤 Users (`src/users`)
Management of user profiles, allowing creation, update, and retrieval of registration data.

### 📅 Categories (`src/category`)
Module for task organization:
- Allows creating and managing categories to be linked to tasks.

### 📝 Tasks (`src/tasks`)
The application core:
- Implements the task CRUD, allowing the management of the user's activities life cycle.

### 🔄 Orchestrators (`src/shared/orquestador`)
Contains the logic for complex "Use Cases" that coordinate multiple services, such as:
- User creation with automatic role linking.
- Management of task and category drafts.
- Batch operations (delete/update) involving multiple entities.

### 🏗️ Infrastructure and Core (`src/shared/core`)
Reusable cross-cutting components:
- **Decorators:** Customizations for User-Agent extraction, request data, and exception handling.
- **Base Classes:** Abstractions for Repositories, Schemas, and database Transactions.
- **Notification:** Internal system for signaling domain events or errors.

### 🗄️ Database (`src/config`, `src/migrations`, `src/seeders`)
- **MikroORM Config:** Central configuration for the ORM and PostgreSQL connection.
- **Migrations:** History of database schema evolution.
- **Seeders:** Scripts to populate the database with initial data (permissions, default roles, etc.).

---

## 🛠️ Main Commands

### Initial Setup
```bash
# Install dependencies
npm install

# Start containers (PostgreSQL) if compose.yaml exists
docker-compose up -d
```

### Database
```bash
# Run pending migrations
npm run mikro-orm:up

# Generate Swagger documentation
npm run doc:generate
```

### Execution
```bash
# Development (with watch)
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Tests
```bash
# Unit tests
npm run test

# Integration tests (e2e)
npm run test:e2e
```

## 📝 API Documentation
After starting the server, the **Swagger** documentation (if enabled) or the `swagger.json` file in the root details all available endpoints.
