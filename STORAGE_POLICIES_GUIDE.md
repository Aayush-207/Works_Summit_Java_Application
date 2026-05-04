# Storage RLS Policies - Detailed Visual Guide

## Where to Find Storage Policies in Supabase

### Step 1: Open Supabase Storage Policies

1. Go to your **Supabase Dashboard**: https://app.supabase.com
2. Click on your **project** (hotel-booking-app)
3. In the **left sidebar**, click **Storage**
4. You'll see two tabs at the top: **Buckets** and **Policies**
5. Click the **Policies** tab

Your screen should show:
```
┌─────────────────────────────────────┐
│ Storage                              │
├─────────────────────────────────────┤
│ [Buckets] [Policies]  ← Click here   │
├─────────────────────────────────────┤
│ Storage policies for bucket public   │
│                                      │
│ [+ New Policy]  ← Button to click    │
└─────────────────────────────────────┘
```

---

## Adding the 3 Policies

### Policy 1: Allow Image Upload (INSERT)

**Step 1:** Click **[+ New Policy]** button

**Step 2:** A modal appears. Select:
- **Creation method**: "For custom expressions" ← Choose this
- Click button to continue

**Step 3:** Fill the form:

```
Allowed operation: [INSERT ▼]  ← Click dropdown, select INSERT
Target role:       [anon ▼]    ← Click dropdown, select anon
```

**Step 4:** Below that, there's a large text box. Paste:
```
bucket_id = 'hotel-images'
```

**Step 5:** Click **[Review]** button

**Step 6:** Click **[Save policy]** button ✅

---

### Policy 2: Allow Image Download (SELECT)

**Repeat the same steps:**

1. Click **[+ New Policy]** 
2. Select "For custom expressions"
3. Fill the form:
   - **Allowed operation**: `SELECT` (click dropdown)
   - **Target role**: `anon` (click dropdown)
4. Paste in text box: `bucket_id = 'hotel-images'`
5. Click **[Review]**
6. Click **[Save policy]** ✅

---

### Policy 3: Allow Image Delete (DELETE)

**Repeat again:**

1. Click **[+ New Policy]**
2. Select "For custom expressions"
3. Fill the form:
   - **Allowed operation**: `DELETE` (click dropdown)
   - **Target role**: `anon` (click dropdown)
4. Paste in text box: `bucket_id = 'hotel-images'`
5. Click **[Review]**
6. Click **[Save policy]** ✅

---

## ✅ Verification

After adding all 3 policies, your **Policies** tab should show:

```
Storage policies for bucket public

┌─────────────────────────────────────────────┐
│ Policy 1:                                    │
│ Operation: INSERT                           │
│ Role: anon                                  │
│ Expression: bucket_id = 'hotel-images'      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Policy 2:                                    │
│ Operation: SELECT                           │
│ Role: anon                                  │
│ Expression: bucket_id = 'hotel-images'      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Policy 3:                                    │
│ Operation: DELETE                           │
│ Role: anon                                  │
│ Expression: bucket_id = 'hotel-images'      │
└─────────────────────────────────────────────┘
```

If you see all 3 policies listed, you're done! ✅

---

## ❓ Common Issues

### Issue: I can't find the Policies tab
- ✅ Make sure you're in **Storage** section (left sidebar)
- ✅ Look for tabs at the top: **[Buckets] [Policies]**

### Issue: "For custom expressions" option doesn't appear
- ✅ You should see options like:
  - "Enable read access for anonymous users"
  - "Enable write access for anonymous users"
  - **"For custom expressions"** ← Choose this one

### Issue: Can't find the text box for the expression
- ✅ After selecting "For custom expressions", scroll down
- ✅ The large text box should be below the role/operation dropdowns

### Issue: The policy isn't saving
- ✅ Make sure you clicked **[Review]** first
- ✅ Then click **[Save policy]** on the review screen
- ✅ Wait a few seconds for it to save

---

## 🎯 Quick Checklist

- [ ] Opened Storage → Policies tab
- [ ] Clicked "+ New Policy" and added first policy (INSERT)
- [ ] Clicked "+ New Policy" and added second policy (SELECT)  
- [ ] Clicked "+ New Policy" and added third policy (DELETE)
- [ ] All 3 policies are visible on the Policies page
- [ ] Each policy shows: `bucket_id = 'hotel-images'` and role `anon`

Once all checked, go back to the app and try uploading an image! 🚀
