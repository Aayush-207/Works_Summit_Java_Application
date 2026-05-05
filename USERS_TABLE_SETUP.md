# Supabase Users Table Setup

This guide will help you create the `users` table and add test credentials for authentication.

## Why This Is Needed

The Spring Boot auth service tries to authenticate users by querying the Supabase `users` table. Without this table and test data, all login attempts return **401 Unauthorized**.

## Step 1: Create Users Table

Go to your Supabase project dashboard → **SQL Editor** → Create a new query and run this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public SELECT (for login checks)
CREATE POLICY "Allow public select" ON users
  FOR SELECT
  USING (true);

-- Policy: Allow public INSERT (for signup)
CREATE POLICY "Allow public insert" ON users
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow UPDATE on own record
CREATE POLICY "Allow update on own record" ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);
```

## Step 2: Add Test Users

Run this SQL in the same editor to insert test accounts:

```sql
-- Insert admin user (password: admin123)
INSERT INTO users (username, password_hash, role) 
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye6wbM6rQFKQ3xNzTf2f2LqfkZH9q1HJK',
  'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

-- Insert regular user (password: user123)
INSERT INTO users (username, password_hash, role) 
VALUES (
  'user',
  '$2a$10$bYhxWaMf7h4H8e3MzqFbwOELRPaSpUqMWvPXl1vVQi0JLqKvJ9Bq6',
  'USER'
)
ON CONFLICT (username) DO NOTHING;

-- Verify insertion
SELECT id, username, role FROM users;
```

## Step 3: Test the Setup

**Login with these credentials:**

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | ADMIN |
| user     | user123  | USER |

## Step 4: Restart Your Services

After adding the users, restart both services:

**Terminal 1 (Auth Service):**
```bash
cd d:\Company\Summit Works\hotel-booking-app\auth-service
mvn spring-boot:run
```

**Terminal 2 (Web App):**
```bash
cd d:\Company\Summit Works\hotel-booking-app\web-app
npm start
```

## Troubleshooting

### Still getting 401 after setup?

1. **Verify users were inserted:**
   ```sql
   SELECT COUNT(*) FROM users;
   ```
   Should return: `2` (admin + user)

2. **Check table structure:**
   ```sql
   SELECT column_name, data_type FROM information_schema.columns 
   WHERE table_name = 'users';
   ```

3. **Test the REST API directly** (using Supabase credentials):
   ```bash
   curl -X GET "https://yytgzdqkautnpfqxfomj.supabase.co/rest/v1/users?username=eq.admin" \
     -H "apikey: sb_publishable_ZeXbsrLCcGDZzXziWFdaFw_wlXGcWzk"
   ```

4. **Check Spring logs** for error details:
   ```
   UserService.getUserByUsername() → Check Supabase response
   ```

## Optional: Create Hotels & Bookings Tables

If you also want to set up the hotels and bookings tables:

```sql
-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2),
  image_url VARCHAR(500),
  location VARCHAR(255),
  unavailable_dates TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL REFERENCES hotels(id),
  reserved_date DATE NOT NULL,
  reserved_for_user VARCHAR(255) NOT NULL,
  amount_paid DECIMAL(10, 2),
  booked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(hotel_id, reserved_date)
);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public select hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select bookings" ON bookings FOR SELECT USING (true);
```

## How Authentication Works

```
1. User enters username/password in Angular login form
2. Angular posts to: POST http://localhost:8081/api/auth/login
3. Spring AuthController receives request
4. Spring Security's AuthenticationManager authenticates via SupabaseUserDetailsService
5. SupabaseUserDetailsService calls UserService.getUserByUsername()
6. UserService queries Supabase: GET /rest/v1/users?username=eq.{username}
7. Password verified with BCryptPasswordEncoder.matches()
8. If valid → JWT token generated and returned
9. Angular stores token in localStorage
10. Subsequent requests include JWT in Authorization header
```

## Security Notes

⚠️ **These bcrypt hashes are for demo purposes only.**

For production:
- Use Supabase Auth (managed JWT + password hashing)
- Never store plaintext passwords
- Use environment variables for sensitive data
- Enable stricter RLS policies (not `true` for all)
- Rotate credentials regularly
