# Auth Service (Spring Boot)

Authentication Service for the Hotel Booking Application.

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Security
- JWT

## Running the Auth Service
```bash
mvn clean install
mvn spring-boot:run
```
Runs on `http://localhost:8081`.

## Endpoints
- `POST /api/auth/login`: Authenticate and get JWT.

## Test Users
| Username | Password   | Role  |
|----------|------------|-------|
| admin    | admin123   | ADMIN |
| user     | user123    | USER  |
