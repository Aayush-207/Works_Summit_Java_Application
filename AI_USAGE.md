# AI Usage & Development Prompts

This document contains the complete AI prompts and strategies used to build the Hotel Booking App. These prompts can be reused for similar projects or adapted for different requirements.

## Project Initialization Prompts

### 1. Project Setup & Framework Selection
**Prompt:**
```
Create a full-stack hotel booking application with:
- Frontend: Angular 21 with standalone components, TypeScript
- Backend: Spring Boot 3.2 with JWT authentication
- Database: Supabase PostgreSQL with real-time capabilities
- Features: User authentication, hotel browsing, date-based booking, admin dashboard

Project structure should have:
- Clear separation between auth-service (backend) and web-app (frontend)
- Modular component architecture
- Service-based API communication
- Type-safe TypeScript models
```

### 2. Tailwind CSS v4 Configuration
**Prompt:**
```
Setup Tailwind CSS v4 with @tailwindcss/postcss in Angular 21 project:
- Install @tailwindcss/postcss as the primary engine
- Configure postcss.config.mjs for Angular
- Create @source directives to scan inline component templates
- Implement custom utility classes: .glass-card, .btn-primary, .input-field
- Define color scheme: Cyan (#06b6d4) primary, Emerald (#10b981) secondary
- Ensure Tailwind scans both .html files and inline TypeScript templates
```

---

## Frontend Development Prompts

### 3. Authentication Component Design
**Prompt:**
```
Create a login.component with dual-mode authentication:

Requirements:
- Toggle between login and signup modes with smooth transitions
- Login fields: username, password (with show/hide toggle)
- Signup fields: username, email, password (with strength meter)
- Form validation: 
  * Username: 3-20 chars, no special chars
  * Email: valid format
  * Password: min 8 chars, uppercase, lowercase, number
- Error message display (red toast)
- Demo credentials panel showing test user info
- Glass-morphism design with cyan-emerald gradients
- Loading state with spinner during submission

Style in glass-morphism with:
- Semi-transparent white background with backdrop blur
- Gradient buttons (cyan to emerald)
- Animated input fields with focus effects
- Centered layout with hero image backdrop
```

### 4. Hotel Card with Modal Popup
**Prompt:**
```
Design hotel-card.component with modal-based booking flow:

Card View (Collapsed):
- Hotel image with gradient overlay and location badge
- Hotel name, price per night, short description
- Arrow button at bottom with text "↓ View Details"
- Card hover effect: lift up with enhanced shadow
- Image zoom on hover

Modal Popup (Details View):
- Full hotel description
- Special offers grid (2-column layout)
- Booking calendar (7-day date picker)
- Selected date display with highlight
- Hotel name and price in gradient header
- Action buttons: "Book Now" and "Cancel"
- Close button (×) in top-right corner
- Smooth slideUp animation on open

Features:
- Disable and grey out unavailable dates in calendar
- Prevent booking without date selection
- Show loading spinner during booking submission
- Auto-close success modal after 3 seconds
- Pass unavailableDates array to calendar component

Styling:
- Glass effect on modal background
- Smooth animations (fadeIn, slideUp, scaleIn)
- Gradient header and buttons
- Responsive on mobile (full screen with padding)
```

### 5. Booking Calendar Component
**Prompt:**
```
Create booking-calendar.component with intelligent date picking:

Features:
- Display next 7 days from today
- Show day name (Mon, Tue, etc) and date number
- Highlight available dates in cyan
- Grey out and disable unavailable dates (show × mark)
- Selected date shows gradient background (cyan to emerald)
- Hover effect for available dates: slight lift and color change

Implementation:
- Accept @Input unavailableDates: string[] (ISO format dates)
- Accept @Input selectedDate: string | null
- Emit @Output dateSelected: string (ISO date format)
- Check if date exists in unavailableDates array
- OnChanges lifecycle to update when unavailableDates changes
- Prevent dateSelected event for unavailable dates

Styling:
- Grid layout with 7 columns (one per day)
- Rounded buttons with transitions
- Show disabled/unavailable state with opacity: 0.5
- Hover animations only for available dates
```

### 6. Admin Dashboard Design
**Prompt:**
```
Create admin-dashboard.component with two main sections:

Left Section - Bookings Table:
- Columns: Hotel Name | Reserved Date | Guest Name | Amount Paid
- Sort by date (most recent first)
- Format price as currency (INR symbol)
- Format dates as "MMM dd, yyyy"
- Row hover effect with subtle shadow

Right Section - Hotel Management:
- Grid of hotel cards with image, name, price
- Delete button on each card with confirmation dialog
- Add Hotel button opens modal form
- OnHotelAdded event refreshes hotel list

Stats Card:
- Show "Total Bookings: X" count
- Update when new booking added or hotel deleted

Features:
- Load bookings from bookingService (all users' bookings)
- Load hotels from hotelService
- Confirmation dialog before hotel deletion
- Success/error toast notifications

Styling:
- Glass-morphism cards
- Gradient headers and buttons
- Responsive grid (1 column on mobile, 2+ on desktop)
- Icons for actions (delete, add)
```

### 7. Add Hotel Modal Form
**Prompt:**
```
Create add-hotel form component inside admin dashboard modal:

Form Fields:
- Hotel Name (text input, required)
- Location (text input, required)
- Price Per Night (number input, required, min 0)
- Description (textarea, required, min 50 chars)
- Image Upload (file input, image only)

Features:
- Image preview in real-time using FileReader
- Validate file type (only images)
- Validate file size (max 5MB)
- Form validation with error messages
- Disable submit button until all fields valid
- Show loading state during upload

Success Handling:
- Display success modal with checkmark animation
- Show message: "Hotel Added Successfully"
- Auto-close after 3 seconds
- Emit hotelAdded event to parent component
- Clear form after success

Styling:
- Modal overlay with backdrop blur
- Glass-morphism card
- Gradient buttons
- Green success indicator

Technical:
- Use FormBuilder for reactive forms
- NgZone.run() for file preview change detection
- Supabase Storage for image upload with public URL
- Handle async file upload without blocking UI
```

### 8. Angular Services Architecture
**Prompt:**
```
Create type-safe Angular services:

auth.service.ts:
- login(credentials: LoginRequest): Observable<AuthResponse>
- register(request: RegisterRequest): Observable<AuthResponse>
- getToken(): string | null
- getRole(): string | null
- getUsername(): string | null
- isAdmin(): boolean
- logout(): void
- Store token in localStorage under key 'auth_token'
- Store role and username in localStorage

hotel.service.ts:
- getHotels(): Observable<Hotel[]> (cache results)
- addHotel(hotel: HotelInput): Observable<Hotel>
- deleteHotel(hotelId: string): Observable<void>
- uploadImage(file: File): Promise<string> (return public URL)
- Initialize Supabase client once
- Call supabase.from('hotels') for all queries

booking.service.ts:
- createBooking(booking: BookingInput): Promise<void>
- getBookings(): Observable<Booking[]>
- getHotelBookings(hotelId: string): Observable<Booking[]>
- Call supabase.from('bookings') for all queries

seed.service.ts:
- loadSampleHotels(): Promise<void>
- Pre-populate 5-6 sample hotels if table empty
- Called on app initialization

Implementation:
- Use inject() for dependency injection
- TypeScript interfaces for type safety
- Signal() for reactive state
- Observable for async operations
- Error handling with catchError operator
```

### 9. Route Guards & Authentication Flow
**Prompt:**
```
Create Angular route guards:

auth.guard.ts:
- Check if user has valid JWT token in localStorage
- If not, redirect to /login
- Allow navigation only to login/signup/home if not authenticated
- Redirect to user-dashboard if already logged in

role.guard.ts:
- Check if user role is 'ADMIN'
- Extract role from localStorage
- If not admin, redirect to /user-dashboard
- Show error toast: "Access denied"

Route Configuration:
- /login - login.component (public)
- /user-dashboard - user-dashboard.component (auth.guard)
- /admin-dashboard - admin-dashboard.component (auth.guard + role.guard)
- Redirect root (/) to dashboard based on role

Implementation:
- Use canActivate guard on protected routes
- Async guard checking with returnUrl support
- Handle logout and session expiration
```

### 10. Global UI Styling & Theme
**Prompt:**
```
Create consistent global UI theme using Tailwind CSS v4:

Color Palette:
- Primary: Cyan #06b6d4
- Secondary: Emerald #10b981
- Background: Light slate #f8fafc
- Text: Dark slate #1e293b
- Border: Light border #e2e8f0

Component Patterns:
- .glass-card: backdrop blur, semi-transparent white background
- .btn-primary: gradient background, hover lift effect, 0.3s transition
- .input-field: rounded border, focus outline in cyan, placeholder gray
- .modal-overlay: dark background with blur, fixed positioning, z-index 100

Typography:
- Headings: font-weight 700-900, tracking tight
- Body: font-size 0.875-1rem, line-height 1.5-1.6
- Labels: font-size 0.75rem, uppercase, letter-spacing 0.1em

Animations (Global Keyframes):
- @keyframes fadeIn: opacity 0 → 1 (0.2s)
- @keyframes slideUp: transform translateY(10px) → 0, opacity 0 → 1 (0.3s)
- @keyframes scaleIn: transform scale(0.8) → 1 (0.3s)
- @keyframes spin: rotate 0 → 360deg (1s linear infinite)

Responsive Design:
- Mobile first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Adjust padding/margins for mobile
- Modal full-screen on mobile with padding
- Grid 1 column on mobile, 2+ on desktop
```

---

## Backend Development Prompts

### 11. Spring Security Configuration with JWT
**Prompt:**
```
Setup Spring Security for JWT-based authentication:

Configuration:
- Disable CSRF for stateless API
- Enable CORS: allowedOriginPatterns("http://localhost:*", ...)
- All HTTP methods allowed (GET, POST, PUT, DELETE, OPTIONS)
- Authorization header required
- Permit: POST /api/auth/login, POST /api/auth/register, OPTIONS
- Require authentication: all other endpoints
- Stateless session management

DaoAuthenticationProvider:
- Use custom SupabaseUserDetailsService
- Set PasswordEncoder to BCryptPasswordEncoder
- Load user from Supabase by username

SecurityFilterChain:
- Add filter before existing filters
- Build stateless security filter chain
- Return SecurityFilterChain bean

PasswordEncoder:
- Use BCryptPasswordEncoder with default strength (10)
- Hash passwords during registration
- Verify passwords during login
```

### 12. Supabase Integration Service
**Prompt:**
```
Create UserService for Supabase REST API integration:

Methods:
- registerUser(RegisterRequest): 
  * Hash password with BCryptPasswordEncoder
  * POST to supabase.url/rest/v1/users
  * Include apikey and Authorization headers
  * Check username uniqueness first
  * Throw exception if username exists

- getUserByUsername(username):
  * GET from supabase.url/rest/v1/users?username=eq.{username}
  * Return User object with password_hash, role
  * Handle 404 with UsernameNotFoundException

- getUserRole(username):
  * Query users table for role field
  * Return role string

- userExists(username):
  * Check if username exists before registration

HTTP Headers:
- Authorization: Bearer {service_role_key}
- apikey: {anon_key}
- Content-Type: application/json

Implementation:
- Use RestTemplate for HTTP calls
- @Value injection for Supabase credentials
- ObjectMapper for JSON serialization
- Singleton for shared RestTemplate
```

### 13. JWT Token Generation & Validation
**Prompt:**
```
Create JwtUtil for JWT operations:

generateToken(username, role):
- Algorithm: HS512
- Payload: 
  * subject: username
  * claim "role": role
  * issued at (iat): current time
  * expiration (exp): 24 hours from now
- Secret: injected from @Value("${jwt.secret}")
- Return encoded token string

validateToken(token):
- Verify signature with secret
- Check expiration date
- Return true if valid, false otherwise

getUsernameFromToken(token):
- Parse token without verification (for extraction)
- Return subject claim

getRoleFromToken(token):
- Extract "role" custom claim
- Return role string

Implementation:
- Use jjwt library (io.jsonwebtoken:jjwt)
- Handle JwtException for invalid tokens
- Return Claims object for multiple extractions
- Static import for convenient access
```

### 14. REST Endpoint Design
**Prompt:**
```
Create AuthController with JWT endpoints:

@PostMapping("/login"):
- Accept LoginRequest { username, password }
- Use AuthenticationManager to authenticate
- If successful, generate JWT with JwtUtil
- Return AuthResponse { token, role, username }
- Status: 200 OK or 401 Unauthorized

@PostMapping("/register"):
- Accept RegisterRequest { username, email, password }
- Call UserService.registerUser()
- Generate JWT on success
- Return AuthResponse { token, role, username }
- Status: 201 Created
- Status: 409 Conflict if username exists

Error Handling:
- BadCredentialsException → 401 Unauthorized
- UsernameNotFoundException → 401 Unauthorized
- DataIntegrityViolationException → 409 Conflict
- Generic Exception → 400 Bad Request

Response Format:
- Success: { "token": "jwt", "role": "USER", "username": "john" }
- Error: { "error": "Invalid credentials", "timestamp": "..." }
```

### 15. Data Transfer Objects (DTOs)
**Prompt:**
```
Create DTOs for type-safe API communication:

LoginRequest:
- username: String (required)
- password: String (required, min 8 chars)

RegisterRequest:
- username: String (required, unique, 3-20 chars)
- email: String (required, valid email format)
- password: String (required, min 8 chars)

AuthResponse:
- token: String (JWT token)
- role: String (USER or ADMIN)
- username: String (authenticated user)

Implementation:
- Use Jakarta validation annotations
- @NotBlank for required fields
- @Size for length validation
- @Email for email format
- @UniqueUsername custom annotation for duplicate check
- Lombok @Data for getters/setters
```

---

## Database & Supabase Prompts

### 16. Supabase Database Schema Setup
**Prompt:**
```
Create PostgreSQL tables in Supabase for hotel booking:

users Table:
- id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- username: VARCHAR(255) UNIQUE NOT NULL
- email: VARCHAR(255)
- password_hash: VARCHAR(255) NOT NULL (bcrypt hash)
- role: VARCHAR(50) DEFAULT 'USER' (enum: USER, ADMIN)
- created_at: TIMESTAMP DEFAULT NOW()
- Index on username for fast lookups

hotels Table:
- id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- name: VARCHAR(255) NOT NULL
- description: TEXT
- location: VARCHAR(255)
- pricePerNight: DECIMAL(10, 2)
- imageUrl: VARCHAR(500)
- unavailableDates: TEXT[] (array of ISO date strings)
- created_at: TIMESTAMP DEFAULT NOW()

bookings Table:
- id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- hotelId: UUID REFERENCES hotels(id) ON DELETE CASCADE
- hotelName: VARCHAR(255)
- reservedDate: DATE NOT NULL
- reservedForUser: VARCHAR(255)
- amountPaid: DECIMAL(10, 2)
- created_at: TIMESTAMP DEFAULT NOW()
- Index on (hotelId, reservedDate)

Row Level Security:
- Enable RLS on all tables
- Create policies for public read/write or authenticated write
```

### 17. Supabase RLS Policies
**Prompt:**
```
Create Row Level Security policies in Supabase:

users Table Policies:
- SELECT policy: Allow public read (for user enumeration - demo only)
- INSERT policy: Allow public insert (for registration)
- UPDATE policy: Deny (prevent user modification)
- DELETE policy: Deny (prevent user deletion)

hotels Table Policies:
- SELECT policy: Allow public read
- INSERT policy: Authenticated only (admin adds hotels)
- UPDATE policy: Authenticated only
- DELETE policy: Authenticated only

bookings Table Policies:
- SELECT policy: Users see only their own bookings (auth.uid() check)
- INSERT policy: Authenticated users can book
- UPDATE policy: Deny (prevent modification)
- DELETE policy: Authenticated users can delete own bookings

Storage Policies:
- Create 'hotel-images' bucket
- Public read access for images
- Authenticated write access
- Set max upload size to 5MB
```

### 18. Pre-seeded User Data
**Prompt:**
```
Create pre-seeded test accounts in Supabase:

Admin User:
- username: "admin"
- email: "admin@hotelbooking.com"
- password_hash: bcrypt hash of "admin123"
- role: "ADMIN"

Regular User:
- username: "user"
- email: "user@hotelbooking.com"
- password_hash: bcrypt hash of "user123"
- role: "USER"

Sample Hotels:
- "The Grand Plaza": Location Delhi, Price ₹5000
- "Sunset Beach Resort": Location Goa, Price ₹3500
- "Mountain Peak Hotel": Location Shimla, Price ₹4000
- "Urban Suite": Location Mumbai, Price ₹6000
- "Lake View Inn": Location Udaipur, Price ₹4500

Implementation:
- Hash passwords using online bcrypt tool during setup
- Use INSERT statements to populate tables
- Test with these credentials before users register
```

---

## Integration & Testing Prompts

### 19. API Integration Testing
**Prompt:**
```
Test authentication flow end-to-end:

Login Test:
1. POST /api/auth/login with valid credentials
2. Expect 200 OK with token, role, username
3. Store token in localStorage
4. Try accessing protected endpoint with token
5. Expect 200 OK

Registration Test:
1. POST /api/auth/register with new credentials
2. Expect 201 Created
3. Immediately login with same credentials
4. Expect 200 OK with token

Invalid Request Tests:
1. Login with wrong password → 401 Unauthorized
2. Login with nonexistent username → 401 Unauthorized
3. Register with duplicate username → 409 Conflict
4. Register with weak password → 400 Bad Request
```

### 20. Frontend Service Integration
**Prompt:**
```
Test Angular services integration:

Auth Service:
1. Call login() with credentials
2. Verify token stored in localStorage
3. Call getRole() and verify it returns correct role
4. Test isAdmin() returns true/false correctly

Hotel Service:
1. Call getHotels()
2. Verify returned array has correct structure
3. Test addHotel() with image upload
4. Verify hotel appears in getHotels()

Booking Service:
1. Call createBooking() with valid data
2. Verify booking appears in getBookings()
3. Test filtering by hotelId

Security Tests:
1. Clear localStorage
2. Try navigating to /admin-dashboard
3. Should redirect to /login
4. Login as regular user
5. Try accessing /admin-dashboard
6. Should redirect to /user-dashboard
```

---

## Debugging & Troubleshooting Prompts

### 21. Common Issues & Solutions
**Prompt:**
```
Troubleshooting checklist:

Tailwind CSS Not Rendering:
- Problem: Components have no styling
- Solution: Ensure @source directive in styles.scss includes:
  @source "src/**/*.{ts,html}"
- Add explicit glob patterns for component templates
- Check postcss.config.mjs has tailwindcss plugin

CORS Errors:
- Problem: 403 Forbidden from Spring backend
- Solution: Update CORS in SecurityConfig:
  allowedOriginPatterns("http://localhost:*")
- Include Authorization header in allowed headers

JWT Token Expired:
- Problem: 401 Unauthorized after 24 hours
- Solution: Implement token refresh mechanism
- Or reduce expiration for testing

Password Hashing Mismatch:
- Problem: BCrypt hashes don't match
- Solution: Always hash with same encoder (default strength 10)
- Don't mix bcryptjs (JS) with Java BCryptPasswordEncoder

File Upload Failing:
- Problem: FileReader events not detected
- Solution: Wrap in NgZone.run()
- Call ChangeDetectorRef.markForCheck() after state change

Modal Not Closing:
- Problem: Modal stays open after booking
- Solution: Ensure closeModal() sets showModal signal to false
- Check z-index of modal (should be 100+)
```

---

## Deployment & Production Prompts

### 22. Environment Configuration
**Prompt:**
```
Setup environment variables for production:

Frontend (.env or environment.ts):
- SUPABASE_URL: https://your-project.supabase.co
- SUPABASE_ANON_KEY: pk_... (public key)
- API_BASE_URL: https://api.yourdomain.com (backend URL)

Backend (application.properties):
- spring.datasource.url: Supabase PostgreSQL connection
- jwt.secret: Strong random string (min 32 chars)
- jwt.expiration: 86400000 (24 hours in ms)
- supabase.url: https://your-project.supabase.co
- supabase.api.key: Service role key (only backend)
- server.port: 8081

Security Notes:
- Never commit API keys to version control
- Use environment variables or .env files
- Service role key only on backend
- Anon key safe to expose on frontend
- Rotate JWT secret regularly
```

### 23. Production Deployment
**Prompt:**
```
Deploy to production:

Frontend (Angular):
1. npm run build
2. Upload dist/ folder to static hosting (Vercel, Netlify, etc.)
3. Configure environment URLs for production
4. Enable HTTPS

Backend (Spring Boot):
1. mvn clean package (builds JAR)
2. Deploy JAR to server (AWS EC2, Heroku, etc.)
3. Set environment variables on server
4. Use production JWT secret
5. Enable HTTPS/SSL
6. Configure CORS for production domain

Database (Supabase):
1. Enable SSL for connections
2. Configure backups
3. Set up RLS policies for production
4. Rotate API keys quarterly
5. Monitor usage and costs

Post-Deployment:
1. Test login/register flow
2. Verify bookings work end-to-end
3. Check error handling and logs
4. Setup error tracking (Sentry, etc.)
5. Monitor performance (New Relic, etc.)
```

---

## Key Learnings & Best Practices

### Frontend Best Practices Used

1. **Angular Signals for State**
   - Use `signal()` for reactive state instead of `@Input/@Output` where possible
   - Enables fine-grained reactivity without zone change detection
   
2. **Standalone Components**
   - All components are standalone (no NgModules)
   - Import only required dependencies
   - Cleaner, more modular architecture

3. **Tailwind CSS v4 with Inline Templates**
   - Explicit `@source` directives required for scanning inline templates
   - Use component-scoped styles instead of global CSS files
   - Leverage Tailwind utilities for responsive design

4. **Type Safety**
   - Define interfaces for all data structures
   - Use `strict: true` in tsconfig.json
   - Avoid `any` type

### Backend Best Practices Used

1. **JWT as Stateless Authentication**
   - No session storage required
   - Tokens are self-contained with role information
   - 24-hour expiration balances security and usability

2. **Supabase Direct Integration**
   - REST API calls from Java backend
   - Service role key for authenticated operations
   - RLS policies handle row-level access

3. **Spring Security Best Practices**
   - Custom UserDetailsService for user loading
   - DaoAuthenticationProvider for password verification
   - CORS configuration for modern APIs
   - CSRF disabled for stateless REST APIs

### Database Best Practices Used

1. **PostgreSQL with UUIDs**
   - Use UUID for globally unique IDs (not incremental)
   - Better security (harder to guess)
   - Works well in distributed systems

2. **RLS for Data Privacy**
   - Policies enforce row-level access control
   - Prevent unauthorized data access
   - Simpler than backend authorization

---

## Reusable Prompt Templates

### Generic Feature Template
```
Create a new feature component that:
- Displays [data type] in [layout type]
- Allows users to [action]
- Shows [status/feedback]
- Styling: Glass-morphism with gradient accents
- Animations: Smooth transitions on [state changes]
- Responsive: Full width on mobile, [layout] on desktop
```

### Service Integration Template
```
Create a service for [feature]:
- Inject dependencies: [required services]
- Methods:
  * get[Entities](): Observable<[Entity][]>
  * add[Entity](data): Observable<[Entity]>
  * delete[Entity](id): Observable<void>
- Error handling with proper exceptions
- Type-safe TypeScript interfaces
- Cache results where appropriate
```

### Spring Endpoint Template
```
Create REST endpoint POST /api/[resource]/[action]:
- Accept [RequestDTO]
- Call [Service].[method]()
- On success: Return [ResponseDTO] with 200/201 status
- On error: Return error message with appropriate status
- Implement proper exception handling
```

---

**Last Updated:** May 2026 | Built entirely with AI pair programming
