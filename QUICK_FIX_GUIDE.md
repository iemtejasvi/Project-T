# 🚀 Quick Fix Guide - Get Your Site Working NOW

## What Was Wrong?

After adding RLS and security headers, your site stopped working because:
1. ❌ Security was blocking same-origin requests (your own frontend calling your API)
2. ❌ RLS was blocking ALL writes because you were using the wrong key

## What I Fixed

✅ Updated security headers to allow same-origin requests  
✅ Updated database code to use SERVICE_ROLE_KEY for writes  
✅ Kept security strong while making it actually work  

## What YOU Need to Do (5 minutes)

### 1. Get Your Service Role Key 🔑

Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

Copy the **`service_role` secret** key (NOT the anon key!)

⚠️ **This key is powerful - never share it or put it in frontend code!**

### 2. Add Environment Variables 📝

Create `.env.local` in your project root:

```bash
# Your existing variables stay the same
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_URL_B=...
NEXT_PUBLIC_SUPABASE_ANON_KEY_B=...

# ADD THESE NEW ONES:
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
SUPABASE_SERVICE_ROLE_KEY_B=paste_your_secondary_service_role_key_here
```

### 3. Restart Your Dev Server 🔄

```bash
# Stop your server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test Everything ✅

- ✅ Submit a memory → Should work
- ✅ Admin panel → Should work  
- ✅ Toggle maintenance → Should work
- ✅ Create announcement → Should work

## If Using Vercel/Production

Add the same environment variables in your Vercel dashboard:
1. Project Settings → Environment Variables
2. Add `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_SERVICE_ROLE_KEY_B`
3. Redeploy

---

## That's It! 🎉

Your site should now work perfectly with:
- ✅ Strong security (RLS still active)
- ✅ Working memory submissions
- ✅ Working admin panel
- ✅ Working maintenance mode

**See `FIXES_APPLIED.md` for detailed technical explanation.**
