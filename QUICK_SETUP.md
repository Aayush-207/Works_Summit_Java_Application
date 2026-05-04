# Hotel Booking App - Supabase Quick Setup

## 🚀 Quick Start (3 Steps)

### Step 1: Create Database Tables (Copy-Paste SQL)

Go to **Supabase Dashboard** → **SQL Editor** → **New Query** and paste:

<details>
<summary><strong>Hotels Table SQL</strong></summary>

```sql
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

CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON public.hotels(created_at DESC);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.hotels FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Allow public insert" ON public.hotels FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.hotels FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.hotels TO anon;
```

**Click RUN** ✅

</details>

<details>
<summary><strong>Bookings Table SQL</strong></summary>

```sql
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  reserved_for_user VARCHAR(255) NOT NULL,
  reserved_date DATE NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booked_at ON public.bookings(booked_at DESC);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.bookings FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Allow public insert" ON public.bookings FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.bookings FOR UPDATE TO PUBLIC USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
```

**Click RUN** ✅

</details>

### Step 2: Configure Storage Bucket

1. Go to **Supabase Dashboard** → **Storage** → **Buckets**
2. Click on **`hotel-images`** bucket
3. Click **Settings** (gear icon)
4. Toggle **Make bucket public** to **ON**
5. **Save** ✅

### Step 3: Add Storage Security Policies

**Go to Supabase Dashboard:**

1. Click **Storage** (left sidebar)
2. Click **Policies** tab (next to Buckets)
3. You should see: "Storage policies for bucket public"

**Create Policy #1 - Upload Permission:**

1. Click **+ New Policy** button
2. Select **For custom expressions**
3. Fill in:
   - **Allowed operation**: Choose `INSERT` from dropdown
   - **Target role**: Choose `anon` from dropdown
4. In the big text box, paste: `bucket_id = 'hotel-images'`
5. Click **Review**
6. Click **Save policy** ✅

**Create Policy #2 - Download Permission:**

1. Click **+ New Policy** button again
2. Select **For custom expressions**
3. Fill in:
   - **Allowed operation**: Choose `SELECT` from dropdown
   - **Target role**: Choose `anon` from dropdown
4. In the big text box, paste: `bucket_id = 'hotel-images'`
5. Click **Review**
6. Click **Save policy** ✅

**Create Policy #3 - Delete Permission:**

1. Click **+ New Policy** button again
2. Select **For custom expressions**
3. Fill in:
   - **Allowed operation**: Choose `DELETE` from dropdown
   - **Target role**: Choose `anon` from dropdown
4. In the big text box, paste: `bucket_id = 'hotel-images'`
5. Click **Review**
6. Click **Save policy** ✅

**You should now see 3 policies listed:**
```
INSERT - anon - bucket_id = 'hotel-images'
SELECT - anon - bucket_id = 'hotel-images'
DELETE - anon - bucket_id = 'hotel-images'
```

---

## ✅ Verification

After completing all 3 steps, refresh your app (Ctrl+R):

- ✅ Admin Dashboard loads without errors
- ✅ Hotel list displays (may show "Seed data added")
- ✅ Can click "Add Hotel" and upload images
- ✅ Success modal appears after adding hotel

---

## ❌ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Could not find the table 'public.hotels'` | Run Hotels Table SQL (Step 1) |
| `Could not find the table 'public.bookings'` | Run Bookings Table SQL (Step 1) |
| `row-level security policy for table "hotels"` | **Urgent!** See `FIX_HOTELS_POLICIES.md` - add INSERT/UPDATE policies |
| `Upload failed: row-level security policy` | **You skipped Step 3!** See STORAGE_POLICIES_GUIDE.md |
| Images not displaying | Make bucket public (Step 2) |
| 404 Not Found on hotel list | Check RLS policies and table permissions |
| Can't find Policies tab | Go to Storage section, look for tabs at top |
| Policy won't save | Click **[Review]** first, then **[Save policy]** |

---

## 🆘 Still Confused About Step 3?

**Check this file:** `STORAGE_POLICIES_GUIDE.md`

It has:
- ✅ Exact location of Policies tab
- ✅ Screenshots/descriptions of each step
- ✅ What the final result should look like
- ✅ Common problems and solutions

---

## 🚨 Getting RLS Policy Error on Hotels?

**Check this file:** `FIX_HOTELS_POLICIES.md`

If you see error: `row-level security policy for table "hotels"`
- ✅ Quick fix with SQL to add missing policies
- ✅ Takes 2 minutes
- ✅ Then everything works!

---

## 📚 Detailed Setup

For complete setup with explanations, see:
- **`SUPABASE_SETUP.md`** - Comprehensive setup with all details
- **`STORAGE_POLICIES_GUIDE.md`** - Visual step-by-step for Step 3 (Storage Policies)

---

## 🏗️ Project Structure

```
hotel-booking-app/
├── auth-service/          # Spring Boot backend (port 8081)
├── web-app/              # Angular frontend (port 4200)
├── SUPABASE_SETUP.md     # Detailed setup guide
└── QUICK_SETUP.md        # This file
```

---

## 🔧 Configuration Reference

**Supabase Credentials** (Already configured):
- URL: `https://yytgzdqkautnpfqxfomj.supabase.co`
- Storage Bucket: `hotel-images`
- Tables: `hotels`, `bookings`

Located in: `web-app/src/environments/environment.ts`

---

**Need help?** Check the browser console (F12) for detailed error messages!
