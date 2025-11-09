# 🔧 Security & RLS Fixes Applied

## Problems Fixed

### 1. **Origin Validation Issue** ✅
**Problem**: Same-origin requests were being blocked with "Origin not allowed" error.

**Root Cause**: 
- Browsers don't always send `Origin` header for same-origin requests
- Your security validation was rejecting requests without an Origin header
- This blocked legitimate API calls from your own frontend

**Solution Applied**:
- Updated `lib/securityHeaders.ts` to allow requests without Origin header
- Added Referer header fallback validation for same-origin requests
- Maintained security by still validating cross-origin requests

### 2. **RLS Blocking All Writes** ✅
**Problem**: All database operations (memories, maintenance, announcements) were failing.

**Root Cause**:
- Supabase RLS policies block ALL writes with anon key: `WITH CHECK (false)`
- Your code was using `ANON_KEY` for everything, including server-side writes
- Server-side operations need `SERVICE_ROLE_KEY` to bypass RLS

**Solution Applied**:
- Created `lib/supabaseServer.ts` with service role client
- Updated `lib/dualMemoryDB.ts` to use separate clients:
  - `client` (anon key) - for reads only
  - `writeClient` (service role) - for insert/update/delete operations
- Updated all write operations to use `writeClient`

---

## 🚨 CRITICAL: Required Setup Steps

### Step 1: Get Your Service Role Keys

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Find the **`service_role` key** (NOT the anon key)
   - ⚠️ **WARNING**: This key bypasses RLS - NEVER expose it to the client!
4. Copy the service role key for both databases (A and B)

### Step 2: Update Environment Variables

Create or update your `.env.local` file with these variables:

```bash
# Database A (Primary)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # ← ADD THIS

# Database B (Secondary)
NEXT_PUBLIC_SUPABASE_URL_B=your_secondary_url
NEXT_PUBLIC_SUPABASE_ANON_KEY_B=your_secondary_anon_key
SUPABASE_SERVICE_ROLE_KEY_B=your_secondary_service_role_key_here  # ← ADD THIS

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**See `env.example.txt` for a complete template.**

### Step 3: Deploy Environment Variables

If you're using Vercel:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these new variables:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY_B`
4. Mark them as **Production**, **Preview**, and **Development**
5. Redeploy your application

### Step 4: Verify RLS Policies

Make sure your Supabase RLS policies are set correctly:

```sql
-- These policies are CORRECT for security:

-- Allow public reads for approved memories
CREATE POLICY "Allow public read approved memories"
ON memories FOR SELECT
USING (status = 'approved');

-- Prevent direct writes (forces use of API with service role)
CREATE POLICY "Prevent direct inserts"
ON memories FOR INSERT
WITH CHECK (false);

CREATE POLICY "Prevent direct updates"
ON memories FOR UPDATE
USING (false);

CREATE POLICY "Prevent direct deletes"
ON memories FOR DELETE
USING (false);
```

These policies mean:
- ✅ Anyone can READ approved memories (with anon key)
- ✅ Server-side API can write (with service role key)
- ❌ No one can write directly to database (bypassing your API)

---

## 📝 What Changed in the Code

### File: `lib/securityHeaders.ts`
- ✅ `isOriginAllowed()` now returns `true` for null origins (same-origin requests)
- ✅ `validateRequest()` uses Referer header as fallback
- ✅ Logs requests without Origin for monitoring

### File: `lib/dualMemoryDB.ts`
- ✅ Added `writeClient` to both database configs
- ✅ `writeClient` uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- ✅ `client` still uses `ANON_KEY` (respects RLS for reads)
- ✅ Updated `insertMemory()` to use `writeClient`
- ✅ Updated `updateMemory()` to use `writeClient`
- ✅ Updated `deleteMemory()` to use `writeClient`
- ✅ Exported `primaryDB` and `secondaryDB` as `writeClient` for admin operations

### New File: `lib/supabaseServer.ts`
- ✅ Server-side Supabase client with service role key
- ✅ Can be imported for other server-side operations

---

## 🧪 Testing

After setting up environment variables and redeploying:

### Test 1: Memory Submission
1. Go to your site
2. Try to submit a memory
3. Should work without "Origin not allowed" error

### Test 2: Admin Panel
1. Go to `/admin`
2. Try to approve/reject a memory
3. Should work without RLS errors

### Test 3: Maintenance Mode
1. In admin panel, try toggling maintenance mode
2. Should update successfully

### Test 4: Announcements
1. In admin panel, try creating an announcement
2. Should save successfully

---

## 🔒 Security Status

| Security Layer | Status | Notes |
|---------------|--------|-------|
| CORS Headers | ✅ Active | Allows same-origin + configured origins |
| Origin Validation | ✅ Active | Validates cross-origin, allows same-origin |
| RLS Policies | ✅ Active | Blocks direct database writes |
| Service Role Key | ✅ Secure | Server-side only, never exposed to client |
| Rate Limiting | ✅ Active | Already working |
| Input Sanitization | ✅ Active | Already working |

---

## ⚠️ Important Security Notes

1. **Never expose SERVICE_ROLE_KEY to the client**
   - Only use in server-side code (API routes, server components)
   - Never include in client-side bundles
   - Never log it or include in error messages

2. **Keep your environment variables secure**
   - Add `.env.local` to `.gitignore` (already done)
   - Don't commit keys to version control
   - Rotate keys if exposed

3. **Monitor your logs**
   - Check for "Request without Origin" warnings
   - These could indicate legitimate requests OR potential attacks
   - Most will be normal Next.js internal requests

---

## 📞 Need Help?

If you're still experiencing issues:

1. **Check environment variables are loaded**:
   ```typescript
   console.log('Has SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
   ```

2. **Check browser console** for any error messages

3. **Check server logs** for database errors

4. **Verify RLS policies** in Supabase dashboard

---

## ✅ Summary

You had TWO separate issues:

1. **Security headers blocking same-origin requests** → Fixed by allowing null Origin
2. **RLS policies blocking all writes** → Fixed by using SERVICE_ROLE_KEY for writes

After adding the environment variables and redeploying, everything should work! 🎉
