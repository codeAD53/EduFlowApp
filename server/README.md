# EduFlowApp - Backend
AI Powered Learning Roadmap Generator Backend with Node.js, Express, TypeScript, PostgreSQL, and Google Gemini AI.
---

## Overview
The EduFlow Backend provide secure REST APIs for authentication, AI-Powered roadmap generation, roadmap management, and learning progress tracking.

The system uses Google Gemini AI to generate personalized learning roadmaps and PostgreSQL to persist user data, roadmaps, resources, and progress.

---

## Features

### Authentication
- **User Registration**
- **User Login**
- **JWT-based Authentication**
- **Password hashing using bcryptjs**
- **Protected Routes**

### AI Roadmap Generation
- **Personalized learning roadmap generation**
- **Topic based structured learning paths**
- **Resource recommendations**
- **AI response validation before persistence**

### Roadmap Management
- **Generate roadmap**
- **Retrieve user Roadmaps**
- **Retreive roadmap details**
- **Delete Roadmaps**
  
### Progress Tracking
- **Mark topic completion**
- **Update learning progress**
- **Retrieve roadmap progress**

### Security
- **Helmet security middleware**
- **Route-level rate limiting**
- **Input validation**
- **Ownership verification**
- **Environment variable validation**
- **Centralized error handling**

### Reliability

- **PostgreSQl transactions**
- **Rollback support**
- **Connection pooling**
- **Structured logging with Pino**
  
---

## Tech Stack
### Runtime
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL
- pg

### Authentication
- JWT (jsonwebtoken)
- bcryptjs

### AI Integration
- Google Gemini API
  
### Validation
- express-validator
- Zod (AI roadmap schema validation)
  
### Security
- Helmet
- Express-rate-limit
  
### Logging
- Pino

---

## Installation

### Clone Respository
`git clone <repo-url>`
`cd server`

### Install Dependencies
`npm install`

### Configure Environment Variables
Create a `.env` file in the root directory.
PORT=5000
NODE_ENV=developement

DB_HOST=
DB_PORT= 
DB_NAME= 
DB_USER= 
DB_PASSWORD= 

JWT_SECRET= 
JWT_EXPIRES_IN=7d 

GEMINI_API_KEY= 

CORS_ORIGIN=http://localhost:5173
### Start Development Server
`npm run dev`

---

## API Endpoints
### Authentication
**Register**
POST /api/auth/register

**Login**
POST /api/auth/login

---

### Roadmaps
**Generate Roadmap**
POST /api/roadmap/generate

**Get User Roadmaps**
GET /api/roadmap

**Get Roadmap By Id**
GET /api/roadmap/:id

**Delete Roadmap**
DELETE /api/roadmap/:id

---

### Progress
**Update Progress**
PATCH /api/progress

**Get Roadmap Progress**
GET /api/progress/:roadmapId

---

### Database Design

## Logging
Structured application logging is implementation using Pino.

Logs include:
- Application startup events
- Database connection events
- Runtime errors

---

## Known Limitations
- AI-generated resources may occasionally contain outdated or unavailable links.
- Resource URLs are validated for format but not availablity.
- Roadmap quality depends on AI-generated responses.

---


## Future Enhancements
OAuth Authentication
Forgot Password Functionality
Email Verification
Refresh Token Authentication
Swagger/OpenAPI Documentation
Resource Availability Verification
AI Quiz Generation
Notes System
User Analytics

## Author
### Aditya Kumar Nayak
EduFlow Backend - AI Powered Learning Roadmap Generator





