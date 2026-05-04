# Hotel Booking Full-Stack Application

A comprehensive hotel booking system with a Spring Boot Auth Service and an Angular Frontend using Firebase Firestore.

## Project Structure
```
hotel-booking-app/
├── auth-service/          ← Spring Boot Application (Port 8081)
└── web-app/               ← Angular Application (Port 4200)
```

## Quick Start

### 1. Prerequisites
- Java 17+, Maven
- Node.js 18+, Angular CLI
- Firebase project with Firestore enabled

### 2. Start Auth Service
```bash
cd auth-service
mvn spring-boot:run
```

### 3. Start Web App
```bash
cd web-app
npm install
# Update Firebase config in src/environments/environment.ts
ng serve
```

## Test Users
| Username | Password   | Role  |
|----------|------------|-------|
| admin    | admin123   | ADMIN |
| user     | user123    | USER  |

## Key Features
- **Auth Service**: JWT-based authentication with role claims.
- **Frontend**: Responsive UI with TailwindCSS.
- **Real-time**: Firestore integration for live updates.
- **Booking**: 1-week calendar with availability tracking.
- **Admin**: Dedicated dashboard for management.
