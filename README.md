# Hotel Booking App

A modern full-stack hotel booking platform built with **Angular**, **Spring Boot**, and **Supabase**.

## 🎯 Features

- **User Authentication** - Secure login/signup with JWT tokens
- **Role-Based Access** - Admin and user dashboards
- **Hotel Browsing** - Modern card UI with hotel details in modal popups
- **Booking Calendar** - Date selection with unavailable date management
- **Admin Dashboard** - View bookings, manage hotels (add/delete)
- **Responsive Design** - Glass-morphism UI with cyan-emerald theme

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 21.2.0, TypeScript 5.9.2, Tailwind CSS v4 |
| **Backend** | Spring Boot 3.2.5, Java, JWT Authentication |
| **Database** | Supabase PostgreSQL with RLS policies |
| **Storage** | Supabase Storage for hotel images |
| **State** | Angular signals, RxJS Observables |

## 📦 Project Structure

```
hotel-booking-app/
├── web-app/                    # Angular frontend
│   ├── src/app/
│   │   ├── features/          # Feature modules (login, user-dashboard, admin-dashboard)
│   │   ├── core/              # Services, guards, models
│   │   └── shared/            # Reusable components
│   └── package.json
├── auth-service/              # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/hotelbooking/authservice/
│   │       ├── controller/    # REST endpoints
│   │       ├── service/       # Business logic
│   │       └── security/      # JWT & Spring Security
│   └── pom.xml
└── docs/
    ├── README.md              # This file
    ├── ARCHITECTURE.md        # System design
    └── AI_USAGE.md           # AI prompts used
```

## 🚀 Quick Start

### Frontend (Angular)
```bash
cd web-app
npm install
npm start
# Runs on http://localhost:4200
```

### Backend (Spring Boot)
```bash
cd auth-service
mvn spring-boot:run
# Runs on http://localhost:8081/api
```

### Database Setup
Supabase PostgreSQL tables:
- `users` - User accounts with bcrypt password hashes, role-based access
- `hotels` - Hotel listings with pricing and images
- `bookings` - User bookings with dates and amounts

Pre-seeded users:
- **admin** / `admin123` (ADMIN role)
- **user** / `user123` (USER role)

## 🔐 Authentication Flow

1. User enters credentials → POST `/api/auth/login` or `/api/auth/register`
2. Spring Security validates against Supabase users table
3. JWT token generated with role and username
4. Angular stores token in localStorage
5. API calls include `Authorization: Bearer <token>` header
6. Role guards protect admin routes

## 📱 Key Components

| Component | Purpose |
|-----------|---------|
| `login.component` | Login/signup with dual modes |
| `hotel-card.component` | Hotel display with modal booking |
| `booking-calendar.component` | Date picker with unavailable date disabling |
| `admin-dashboard.component` | Bookings table + hotel management |
| `auth.service` | Token/role management |
| `hotel.service` | CRUD operations for hotels |
| `booking.service` | Booking creation and queries |

## 🎨 Design Highlights

- **Glass-morphism** cards with backdrop blur effects
- **Gradient buttons** (cyan → emerald)
- **Smooth animations** (fadeIn, slideUp, scaleIn)
- **Modal popups** for hotel details instead of inline expansion
- **Responsive layout** - Works on desktop, tablet, mobile

## ⚙️ Configuration

**Environment Variables** (web-app):
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public API key

**Spring Boot** (auth-service):
- `SUPABASE_URL` - Supabase REST API endpoint
- `SUPABASE_API_KEY` - Service role key for admin operations
- `JWT_SECRET` - Secret key for token signing

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system design and database schema
- **[AI_USAGE.md](./AI_USAGE.md)** - AI prompts used for development
- **[USERS_TABLE_SETUP.md](./USERS_TABLE_SETUP.md)** - SQL setup for user authentication

## 🎓 Learning Resources

See AI_USAGE.md for:
- Complete prompts used for frontend development
- Backend authentication setup prompts
- Database schema creation prompts
- UI/UX design prompts with exact specifications

---

**Built with ❤️ using AI assistance** | [Architecture](./ARCHITECTURE.md) | [AI Usage](./AI_USAGE.md)
