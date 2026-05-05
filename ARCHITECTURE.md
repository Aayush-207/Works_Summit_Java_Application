# System Architecture

## Overview

Hotel Booking App is a three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  Angular Frontend (localhost:4200)                          │
│  - Standalone Components, Angular Signals, Reactive Forms   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST
                   │ JWT Authorization Header
┌──────────────────▼──────────────────────────────────────────┐
│                    API LAYER                                │
│  Spring Boot (localhost:8081/api)                           │
│  - JWT Authentication, Spring Security, Role-based Access  │
│  - REST Controllers, Business Logic, Validation            │
└──────────────────┬──────────────────────────────────────────┘
                   │ REST API Calls
                   │ Service Role Key (admin operations)
┌──────────────────▼──────────────────────────────────────────┐
│                  DATA LAYER                                 │
│  Supabase (PostgreSQL + Storage)                            │
│  - PostgreSQL Database, Row Level Security (RLS)            │
│  - File Storage for Hotel Images                            │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
app.component
├── navbar.component (sticky header)
├── login.component (auth page)
├── user-dashboard.component
│   ├── hotel-card.component (repeating)
│   │   ├── booking-calendar.component
│   │   └── modal (details/booking)
│   └── hotel grid layout
├── admin-dashboard.component
│   ├── bookings table
│   ├── hotels grid
│   └── add-hotel.component (modal)
└── toast.component (notifications)
```

### State Management
- **Angular Signals**: `signal()` for reactive state (showModal, selectedDate, etc.)
- **Services**: Injected with `inject()` for dependency management
- **Observables**: RxJS for async operations (API calls)
- **localStorage**: Persistent storage for JWT tokens and user info

### Key Services

#### auth.service.ts
```typescript
- login(credentials): Observable<AuthResponse>
- register(request): Observable<AuthResponse>
- getToken(): string
- getRole(): string
- isAdmin(): boolean
```

#### hotel.service.ts
```typescript
- getHotels(): Observable<Hotel[]>
- addHotel(hotel): Observable<Hotel>
- deleteHotel(id): Observable<void>
- uploadImage(file): Promise<string>
```

#### booking.service.ts
```typescript
- createBooking(booking): Promise<void>
- getBookings(): Observable<Booking[]>
- getHotelBookings(hotelId): Observable<Booking[]>
```

### Authentication Flow

1. **Login/Register**
   - User submits credentials → POST `/api/auth/login` or `/api/auth/register`
   - Spring validates against Supabase users table
   - JWT token returned with payload: `{ username, role, iat, exp }`
   - Token stored in `localStorage` under key `auth_token`

2. **Protected Requests**
   - JWT interceptor adds `Authorization: Bearer <token>` header
   - Role guard checks `isAdmin()` for admin routes
   - Backend verifies token signature and expiration

3. **Logout**
   - Remove token from localStorage
   - Clear user state signals
   - Redirect to login

### Styling Strategy
- **Tailwind CSS v4.2.4** with `@tailwindcss/postcss`
- **Component-scoped styles** using TypeScript backticks
- **Glass-morphism effect**: `backdrop-filter: blur(8px)`
- **Gradient theme**: Cyan (#06b6d4) → Emerald (#10b981)
- **Animations**: Keyframes for smooth transitions (fadeIn, slideUp, scaleIn)

## Backend Architecture

### Spring Boot Structure
```
src/main/java/com/hotelbooking/authservice/
├── AuthServiceApplication.java (entry point)
├── controller/
│   └── AuthController.java (@PostMapping /login, /register)
├── service/
│   ├── UserService.java (Supabase integration)
│   └── JwtUtil.java (token generation)
├── dto/
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   └── AuthResponse.java
├── security/
│   ├── SecurityConfig.java (Spring Security setup)
│   ├── SupabaseUserDetailsService.java (custom UserDetailsService)
│   └── JwtAuthenticationFilter.java (token validation)
└── exception/
    └── GlobalExceptionHandler.java (error handling)
```

### Security Configuration

#### SecurityConfig.java
```java
- securityFilterChain():
  * Permit: OPTIONS, /api/auth/login, /api/auth/register
  * Require auth: all other endpoints
  * CORS: allowedOriginPatterns("http://localhost:*", ...)
  * CSRF: disabled for stateless API
  
- authenticationManager():
  * Uses DaoAuthenticationProvider with UserDetailsService
  * Password verification with BCryptPasswordEncoder
  
- passwordEncoder():
  * BCryptPasswordEncoder for secure password hashing
```

#### Authentication Provider
```
LoginRequest
  ↓ (POST /api/auth/login)
AuthController
  ↓
AuthenticationManager
  ↓
DaoAuthenticationProvider
  ↓
SupabaseUserDetailsService.loadUserByUsername()
  ↓
UserService.getUserByUsername()
  ↓ (Supabase REST API)
Supabase users table
  ↓ (return password_hash, role)
BCryptPasswordEncoder.matches()
  ↓ (if valid)
JwtUtil.generateToken()
  ↓
AuthResponse { token, role, username }
```

### Supabase Integration

#### UserService.java
```java
- registerUser(RegisterRequest):
  * Hash password with BCryptPasswordEncoder
  * POST to Supabase /rest/v1/users
  * Verify username uniqueness
  
- getUserByUsername(username):
  * GET from Supabase /rest/v1/users?username=eq.{username}
  * Return User object with password_hash and role
  
- getUserRole(username):
  * Query Supabase for role field
  
- userExists(username):
  * Check username uniqueness before registration
```

#### HTTP Headers (Supabase API Calls)
```
Authorization: Bearer <service_role_key>
apikey: <supabase_anon_key>
Content-Type: application/json
```

### JWT Configuration

#### JwtUtil.java
```java
- generateToken(username, role):
  * Payload: { username, role, iat, exp }
  * Signing algorithm: HS512
  * Expiration: 24 hours
  * Secret: loaded from @Value("${jwt.secret}")
  
- validateToken(token):
  * Verify signature and expiration
  * Extract claims (username, role)
  
- getUsernameFromToken(token):
  * Parse JWT and return subject claim
```

## Database Schema

### Supabase PostgreSQL

#### users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_username ON users(username);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_public" ON users
  FOR SELECT USING (true);
CREATE POLICY "users_insert_public" ON users
  FOR INSERT WITH CHECK (true);
```

#### hotels Table
```sql
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  pricePerNight DECIMAL(10, 2),
  imageUrl VARCHAR(500),
  unavailableDates TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotelId UUID REFERENCES hotels(id),
  hotelName VARCHAR(255),
  reservedDate DATE NOT NULL,
  reservedForUser VARCHAR(255),
  amountPaid DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hotel_date ON bookings(hotelId, reservedDate);
```

### RLS (Row Level Security)
- **users table**: Public read/write (for demo purposes)
- **hotels table**: Public read, authenticated write
- **bookings table**: Users can only see their own bookings
- **Storage**: Public read for hotel images

## API Endpoints

### Authentication
```
POST /api/auth/login
  Request: { username, password }
  Response: { token, role, username }
  Status: 200 OK | 401 Unauthorized

POST /api/auth/register
  Request: { username, email, password }
  Response: { token, role, username }
  Status: 201 Created | 409 Conflict (username exists)
```

### Hotels (Frontend calls Supabase directly)
```
GET supabase.from('hotels').select('*')
  Response: Hotel[]

POST supabase.from('hotels').insert(hotelData)
  Request: { name, description, location, pricePerNight, imageUrl }
  Response: Hotel (inserted)

DELETE supabase.from('hotels').delete().eq('id', hotelId)
  Response: void
```

### Bookings (Frontend calls Supabase directly)
```
POST supabase.from('bookings').insert(bookingData)
  Request: { hotelId, hotelName, reservedDate, reservedForUser, amountPaid }
  Response: Booking (inserted)

GET supabase.from('bookings').select('*')
  Response: Booking[]

GET supabase.from('bookings').select('*').eq('reservedForUser', username)
  Response: User's bookings
```

## Data Flow Diagrams

### Login Flow
```
User Input
  ↓
login.component (onLogin)
  ↓
auth.service.login(credentials)
  ↓
POST /api/auth/login (Spring Backend)
  ↓
UserService + DaoAuthenticationProvider
  ↓
Supabase Query (users table)
  ↓
BCrypt Password Verification
  ↓
JWT Token Generation
  ↓
AuthResponse { token, role, username }
  ↓
localStorage storage
  ↓
Route Guard Check (role-based)
  ↓
Dashboard (user or admin)
```

### Booking Flow
```
hotel-card.component (openModal)
  ↓
booking-calendar.component (date selection)
  ↓
Book Now button (bookNow method)
  ↓
booking.service.createBooking()
  ↓
Supabase.from('bookings').insert()
  ↓
showSuccessModal signal
  ↓
Success notification (3 sec auto-close)
  ↓
Close modal + refresh booking list
```

## Performance Considerations

1. **Image Optimization**
   - Supabase Storage for CDN delivery
   - Only upload when form submitted (not on preview)

2. **Calendar Generation**
   - Pre-calculated 7-day window
   - Unavailable dates checked in component
   - No backend calls for calendar

3. **Caching**
   - Hotel list cached in service (single fetch)
   - User token cached in localStorage
   - JWT prevents repeated authentication

4. **Database Queries**
   - Indexed username for fast lookups
   - Indexed hotel-date combinations for bookings

## Security Measures

1. **Authentication**
   - JWT tokens with HS512 signing
   - 24-hour token expiration
   - Service role key never exposed to frontend

2. **Authorization**
   - Role-based access control (USER, ADMIN)
   - Route guards for admin pages
   - Backend validation on protected endpoints

3. **Data Validation**
   - Form validation (email, password strength)
   - Backend DTO validation with annotations
   - Email format validation

4. **Password Security**
   - BCrypt hashing with default rounds (10)
   - Passwords never sent in plain text over API
   - HTTPS enforced in production

5. **CORS Configuration**
   - Restricted to localhost:* in development
   - Can be updated for production domains

## Deployment Notes

- **Frontend**: Hosted on static server (Angular build)
- **Backend**: Spring Boot JAR deployed on server
- **Database**: Supabase managed (no local setup needed)
- **Storage**: Supabase CDN (no local storage required)
