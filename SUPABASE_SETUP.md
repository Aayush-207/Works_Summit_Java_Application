# Supabase Migration Guide

## Setup Instructions

### 1. Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create
5. Wait for project to initialize

### 2. Get Supabase Credentials
1. Go to Project Settings (gear icon)
2. Click "API" in the left sidebar
3. Copy:
   - **Project URL** (under URL section)
   - **Anon Public Key** (under "Project API keys")

### 3. Update Environment Configuration
1. Open `web-app/src/environments/environment.ts`
2. Replace `YOUR_PROJECT_URL` with your Supabase URL
3. Replace `YOUR_ANON_KEY` with your Anon Public Key

### 4. Create Database Tables

Run these SQL commands in Supabase SQL Editor (Project Dashboard > SQL Editor):

```sql
-- Create hotels table
CREATE TABLE hotels (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  location VARCHAR(255) NOT NULL,
  unavailable_dates TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  hotel_id BIGINT NOT NULL REFERENCES hotels(id),
  hotel_name VARCHAR(255),
  reserved_date DATE NOT NULL,
  reserved_for_user VARCHAR(255) NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  booked_at TIMESTAMP DEFAULT NOW()
);

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
