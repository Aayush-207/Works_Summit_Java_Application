# Fix: Add Missing Hotels Table Policies

## The Problem

Your `hotels` table only has a **SELECT** policy, but you need **INSERT** and **UPDATE** policies to:
- Seed initial hotel data ✅
- Add new hotels via the "Add Hotel" form ✅
- Update hotel information ✅

## The Solution

Go to **Supabase Dashboard** → **SQL Editor** → **New Query** and paste this:

```sql
-- Add INSERT policy to hotels table
CREATE POLICY "Allow public insert"
ON public.hotels
FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- Add UPDATE policy to hotels table
CREATE POLICY "Allow public update"
ON public.hotels
FOR UPDATE
TO PUBLIC
USING (true)
WITH CHECK (true);

-- Grant permissions to anon role
GRANT INSERT, UPDATE ON public.hotels TO anon;
```

Then click **RUN** ✅

---

## After Running

1. Refresh your app (Ctrl+R)
2. Go to **Admin Dashboard**
3. You should see seed data loaded
4. Try adding a new hotel - it should work now!

---

## What This Does

These 3 SQL commands add the missing security policies:

| Policy | Allows |
|--------|--------|
| INSERT | App can create new hotels ✅ |
| UPDATE | App can modify hotel info ✅ |
| SELECT | App can read hotels (already existed) ✅ |

**All with anonymous access** (role: `anon`)

---

## Verify It Worked

After running the SQL, go to **Supabase Dashboard** → **Table Editor** → **hotels** → **RLS Policies** tab

You should see **3 policies**:
1. "Allow public read access" (SELECT)
2. "Allow public insert" (INSERT) ← Should be new
3. "Allow public update" (UPDATE) ← Should be new

If you see all 3, you're good to go! 🚀
