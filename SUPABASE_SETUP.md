# Supabase Setup Guide - Hotel Booking App

Complete setup guide to configure Supabase for the Hotel Booking App with database tables and storage policies.

## Step 1: Create Database Tables

Go to **Supabase Dashboard** → **SQL Editor** → **New Query** and run the following SQL scripts:

### 1.1 Create Hotels Table

```sql
-- Create hotels table with UUID primary key
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  unavailable_dates TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON public.hotels(created_at DESC);

-- Enable RLS for public read access
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON public.hotels
FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Allow public insert"
ON public.hotels
FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Allow public update"
ON public.hotels
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant permissions to anon role
GRANT SELECT, INSERT, UPDATE ON public.hotels TO anon;
```

**Run this in SQL Editor**

### 1.2 Create Bookings Table

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  reserved_for_user VARCHAR(255) NOT NULL,
  reserved_date DATE NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booked_at ON public.bookings(booked_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_reserved_date ON public.bookings(reserved_date);

-- Enable RLS with public access
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
ON public.bookings
FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Allow public insert"
ON public.bookings
FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Allow public update"
ON public.bookings
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant permissions to anon role
GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
```

**Run this in SQL Editor**

## Step 2: Configure Storage Bucket RLS Policies

### 2.1 Ensure Bucket is Public

1. Go to **Supabase Dashboard** → **Storage** → **Buckets**
2. Click on **hotel-images** bucket
3. Click **Settings** (gear icon)
4. Toggle **Make bucket public** to **ON**
5. Click **Save**

### 2.2 Add Storage RLS Policies (IMPORTANT!)

Go to **Storage** → **Policies** and create these policies for `hotel-images` bucket:

#### Policy 1: Allow Anonymous Upload

1. Click **+ New Policy**
2. Select **For custom expressions**
3. Choose:
   - **Allowed operation**: `INSERT`
   - **Target role**: `anon` (or leave blank for public)
4. In **Expression** field, paste:
   ```
   bucket_id = 'hotel-images'
   ```
5. Click **Review** → **Save policy**

#### Policy 2: Allow Anonymous Download/Read

1. Click **+ New Policy**
2. Select **For custom expressions**
3. Choose:
   - **Allowed operation**: `SELECT`
   - **Target role**: `anon`
4. In **Expression** field, paste:
   ```
   bucket_id = 'hotel-images'
   ```
5. Click **Review** → **Save policy**

#### Policy 3: Allow Anonymous Delete

1. Click **+ New Policy**
2. Select **For custom expressions**
3. Choose:
   - **Allowed operation**: `DELETE`
   - **Target role**: `anon`
4. In **Expression** field, paste:
   ```
   bucket_id = 'hotel-images'
   ```
5. Click **Review** → **Save policy**

## Step 3: Verify Configuration

### 3.1 Test Database Access
Open browser console (F12) and check:
- ✅ No "Could not find the table 'public.hotels'" error
- ✅ Admin dashboard loads without errors
- ✅ Hotel list appears (if you have seed data)

### 3.2 Test Storage Upload
1. Go to **Admin Dashboard** → **Add Hotel** section
2. Select a hotel image
3. Fill in hotel details:
   - Name: "Test Hotel"
   - Location: "Test City"
   - Price: "5000"
   - Description: "Test hotel description for testing purposes"
4. Click **Add Hotel**
5. ✅ Success modal should appear (green checkmark)
6. ✅ No "row-level security policy" error

## Current Environment Configuration

Your app is configured with:
```
Supabase URL: https://yytgzdqkautnpfqxfomj.supabase.co
Storage Bucket: hotel-images
Database: PostgreSQL (public schema)
```

Location: `web-app/src/environments/environment.ts`

## Troubleshooting

| Error | Solution |
|-------|----------|
| `"Could not find the table 'public.hotels'"` | Run SQL script 1.1 in Supabase SQL Editor |
| `"Could not find the table 'public.bookings'"` | Run SQL script 1.2 in Supabase SQL Editor |
| `"Upload failed: new row violates row-level security policy"` | Add storage RLS policies (Step 2.2) |
| `"bucket_id" does not exist` in storage policy | Make sure bucket name is exactly `hotel-images` (lowercase) |
| Images not displaying after upload | Ensure bucket is set to Public (Step 2.1) |
| 404 Not Found on hotel list | Check database connection and table permissions |

## Quick Setup Checklist

- [ ] ✅ Created `hotels` table with SQL script 1.1
- [ ] ✅ Created `bookings` table with SQL script 1.2
- [ ] ✅ Made `hotel-images` storage bucket public
- [ ] ✅ Added storage RLS policies (3 policies for INSERT, SELECT, DELETE)
- [ ] ✅ App running at `http://localhost:4200`
- [ ] ✅ Auth service running at `http://localhost:8081`
- [ ] ✅ No console errors when loading admin dashboard
- [ ] ✅ Successfully added a hotel with image upload

## Reference

**SQL Editor Access:**
1. Supabase Dashboard → Your Project
2. Left sidebar → **SQL Editor**
3. Click **New Query**
4. Paste SQL script
5. Click **RUN** (Ctrl+Enter)

**Storage Policies Access:**
1. Supabase Dashboard → Your Project
2. Left sidebar → **Storage**
3. Click **Policies** tab (or gear icon on bucket)

-- Create storage bucket for hotel images
-- (Do this in Storage section, create bucket named "hotel-images")
```

### 5. Create Storage Bucket
1. Go to Project Dashboard
2. Click "Storage" in left sidebar
3. Click "Create a new bucket"
4. Name it: `hotel-images`
5. Make it public (toggle on)

### 6. Set Security Policies

In Supabase Dashboard > Storage > Buckets > hotel-images > Policies:

Add policy to allow uploads:
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hotel-images');
```

### 7. Run the Application
```bash
npm start
```

## Features Implemented

✅ **Firebase → Supabase Migration**
- All hotel data now stored in Supabase PostgreSQL
- All bookings data in Supabase
- Authentication remains with Spring Boot backend

✅ **Image Upload & Preview**
- Admin panel: Click to upload hotel images (drag & drop or click)
- Real-time preview before adding hotel
- Images stored in Supabase Storage
- 5MB file size limit
- Support for PNG, JPG, GIF

✅ **Hotel Display**
- User dashboard shows hotel cards with images
- Images loaded from Supabase Storage
- Premium card styling with shadows and hover effects
- Image gradient overlay

✅ **Database Schema**
- Hotels table with all details + image URL
- Bookings table with hotel references
- Timestamps for audit trail
- Unavailable dates array for availability management

## Troubleshooting

**Q: Images not loading?**
A: Check that:
1. Bucket name is exactly `hotel-images`
2. Bucket is set to public
3. Storage policies are configured
4. Image URL is correct in database

**Q: Upload fails?**
A: Verify:
1. Supabase credentials in environment.ts are correct
2. Storage bucket exists and is public
3. File size < 5MB

**Q: Tables not created?**
A: Run SQL commands in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

## Architecture

```
┌─────────────────────────────┐
│      Angular Frontend       │
│  (Hotel cards, Upload form) │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐   ┌──────────────┐
│ Supabase DB  │   │ Supabase     │
│ (Hotels,     │   │ Storage      │
│  Bookings)   │   │ (Images)     │
└──────────────┘   └──────────────┘
       ▲                
       │                
┌──────┴────────────────────────┐
│ Spring Boot Auth Service      │
│ (Login, JWT tokens)           │
└───────────────────────────────┘
```

## Services Created

- `supabase.service.ts` - Supabase client initialization
- `image-upload.service.ts` - Image upload to Supabase Storage
- `hotel.service.ts` - CRUD operations for hotels (Supabase)
- `booking.service.ts` - Booking management (Supabase)
- `seed.service.ts` - Initial data seeding (Supabase)

## Components Updated

- `add-hotel.component.ts` - Image upload with preview
- `hotel-card.component.ts` - Display hotel images
- `hotel.service.ts` - Supabase queries
- `booking.service.ts` - Supabase queries
