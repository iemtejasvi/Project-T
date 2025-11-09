# 🔒 RLS (Row Level Security) Testing Guide

This guide helps you verify that RLS is properly configured and working in both databases.

---

## 📋 Part 1: Check RLS Configuration (Run in Supabase SQL Editor)

### Database A (Primary) - Run These Queries:

```sql
-- ============================================
-- 1. CHECK IF RLS IS ENABLED ON ALL TABLES
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('memories', 'banned_users', 'announcements', 'maintenance', 'site_settings', 'unlimited_users')
ORDER BY tablename;

-- Expected Result: All tables should show "RLS Enabled" = TRUE
-- ✅ If TRUE for all = GOOD
-- ❌ If FALSE for any = BAD (RLS not enabled)


-- ============================================
-- 2. VIEW ALL RLS POLICIES ON MEMORIES TABLE
-- ============================================
SELECT 
    policyname as "Policy Name",
    cmd as "Command",
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as "Using Check",
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as "With Check"
FROM pg_policies 
WHERE tablename = 'memories'
ORDER BY cmd, policyname;

-- Expected Policies:
-- ✅ Policy for SELECT (read) - should exist
-- ✅ Policy for INSERT - should block or be restrictive
-- ✅ Policy for UPDATE - should block or be restrictive
-- ✅ Policy for DELETE - should block or be restrictive


-- ============================================
-- 3. VIEW DETAILED RLS POLICIES
-- ============================================
SELECT 
    schemaname,
    tablename,
    policyname as "Policy Name",
    cmd as "Operation",
    qual::text as "USING (Who Can See)",
    with_check::text as "WITH CHECK (Who Can Insert/Update)"
FROM pg_policies 
WHERE tablename IN ('memories', 'banned_users', 'announcements', 'maintenance', 'site_settings', 'unlimited_users')
ORDER BY tablename, cmd;

-- This shows the EXACT conditions for each policy


-- ============================================
-- 4. CHECK SPECIFIC POLICIES ON EACH TABLE
-- ============================================

-- Memories Table Policies
SELECT 
    policyname,
    cmd,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies 
WHERE tablename = 'memories';

-- Banned Users Table Policies
SELECT 
    policyname,
    cmd,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies 
WHERE tablename = 'banned_users';

-- Announcements Table Policies
SELECT 
    policyname,
    cmd,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies 
WHERE tablename = 'announcements';

-- Maintenance Table Policies
SELECT 
    policyname,
    cmd,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies 
WHERE tablename = 'maintenance';

-- Site Settings Table Policies
SELECT 
    policyname,
    cmd,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies 
WHERE tablename = 'site_settings';

-- Unlimited Users Table Policies
SELECT 
    policyname,
    cmd,
    qual::text as using_clause,
    with_check::text as check_clause
FROM pg_policies 
WHERE tablename = 'unlimited_users';
```

---

## 📋 Part 2: Test RLS Policies (Run in Supabase SQL Editor)

### ⚠️ IMPORTANT: Switch to ANON KEY for Testing

In Supabase SQL Editor, you're using the service role by default. To test with anon key:
1. Use the REST API or
2. Use the JavaScript client with anon key

### Test Script for Memories Table:

```sql
-- ============================================
-- TEST 1: Try to INSERT with service role (Should Work)
-- ============================================
-- This should succeed because you're using service role in SQL editor
INSERT INTO memories (recipient, message, status) 
VALUES ('Test', 'This should work', 'pending')
RETURNING id, recipient, message;

-- Clean up
DELETE FROM memories WHERE message = 'This should work';

-- ✅ If this succeeds = Service role bypasses RLS (GOOD)
-- ❌ If this fails = Something wrong with database permissions


-- ============================================
-- TEST 2: Check if policies exist that block anon writes
-- ============================================
SELECT COUNT(*) as "Blocking Policies Count"
FROM pg_policies 
WHERE tablename = 'memories'
AND cmd IN ('INSERT', 'UPDATE', 'DELETE')
AND (
    with_check::text LIKE '%false%' 
    OR qual::text LIKE '%false%'
);

-- ✅ Should show count > 0 (policies exist that block)
-- ❌ If 0 = No blocking policies (BAD)


-- ============================================
-- TEST 3: Verify SELECT policy allows reads
-- ============================================
SELECT policyname, qual::text
FROM pg_policies 
WHERE tablename = 'memories'
AND cmd = 'SELECT';

-- ✅ Should show a policy with qual = 'true' or '((status)::text = 'approved'::text)'
-- This allows reads


-- ============================================
-- TEST 4: Check table ownership and grants
-- ============================================
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'memories'
AND grantee IN ('postgres', 'anon', 'authenticated', 'service_role');

-- ✅ anon should have SELECT only (or limited)
-- ✅ service_role should have ALL or full access
```

---

## 📋 Part 3: Client-Side Test (JavaScript in Browser Console)

### Test with Anon Key (Run in Browser Console):

```javascript
// ============================================
// BROWSER CONSOLE TEST - Database A
// ============================================

// 1. Initialize Supabase client with ANON key
const { createClient } = supabase;
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your URL
const supabaseAnonKey = 'YOUR_ANON_KEY'; // Replace with your anon key
const client = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// TEST 1: Try to INSERT (Should FAIL with RLS)
// ============================================
console.log('🧪 TEST 1: Attempting INSERT with anon key...');
const { data: insertData, error: insertError } = await client
  .from('memories')
  .insert([{ 
    recipient: 'RLS Test', 
    message: 'This should be blocked by RLS',
    status: 'pending'
  }]);

if (insertError) {
  console.log('✅ GOOD: INSERT blocked by RLS');
  console.log('Error:', insertError.message);
} else {
  console.log('❌ BAD: INSERT succeeded (RLS not working!)');
  console.log('Data:', insertData);
}

// ============================================
// TEST 2: Try to UPDATE (Should FAIL with RLS)
// ============================================
console.log('\n🧪 TEST 2: Attempting UPDATE with anon key...');
const { data: updateData, error: updateError } = await client
  .from('memories')
  .update({ status: 'approved' })
  .eq('id', 'any-id-here'); // Use any ID

if (updateError) {
  console.log('✅ GOOD: UPDATE blocked by RLS');
  console.log('Error:', updateError.message);
} else {
  console.log('❌ BAD: UPDATE succeeded (RLS not working!)');
  console.log('Data:', updateData);
}

// ============================================
// TEST 3: Try to DELETE (Should FAIL with RLS)
// ============================================
console.log('\n🧪 TEST 3: Attempting DELETE with anon key...');
const { data: deleteData, error: deleteError } = await client
  .from('memories')
  .delete()
  .eq('id', 'any-id-here'); // Use any ID

if (deleteError) {
  console.log('✅ GOOD: DELETE blocked by RLS');
  console.log('Error:', deleteError.message);
} else {
  console.log('❌ BAD: DELETE succeeded (RLS not working!)');
  console.log('Data:', deleteData);
}

// ============================================
// TEST 4: Try to SELECT (Should WORK)
// ============================================
console.log('\n🧪 TEST 4: Attempting SELECT with anon key...');
const { data: selectData, error: selectError } = await client
  .from('memories')
  .select('id, recipient, message, status')
  .eq('status', 'approved')
  .limit(5);

if (selectError) {
  console.log('❌ BAD: SELECT failed (should work!)');
  console.log('Error:', selectError.message);
} else {
  console.log('✅ GOOD: SELECT succeeded');
  console.log('Retrieved', selectData?.length || 0, 'memories');
}

// ============================================
// SUMMARY
// ============================================
console.log('\n📊 RLS TEST SUMMARY:');
console.log('INSERT blocked:', !!insertError);
console.log('UPDATE blocked:', !!updateError);
console.log('DELETE blocked:', !!deleteError);
console.log('SELECT allowed:', !selectError);
console.log('\n✅ All tests should be TRUE for proper RLS');
```

---

## 📋 Part 4: Database B (Secondary) Tests

### Run Same Queries for Database B:

**NOTE:** Database B only has 3 tables: `memories`, `site_settings`, `unlimited_users`

```sql
-- ============================================
-- DATABASE B - CHECK RLS
-- ============================================

-- 1. Check RLS enabled
SELECT 
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('memories', 'site_settings', 'unlimited_users')
ORDER BY tablename;

-- 2. View policies
SELECT 
    tablename,
    policyname as "Policy Name",
    cmd as "Operation",
    qual::text as "USING Clause",
    with_check::text as "WITH CHECK Clause"
FROM pg_policies 
WHERE tablename IN ('memories', 'site_settings', 'unlimited_users')
ORDER BY tablename, cmd;

-- 3. Test with browser console (same script as above, but use Database B credentials)
```

---

## 📋 Part 5: Quick Command Line Test (Optional)

### Using cURL to Test API:

```bash
# ============================================
# TEST API ENDPOINTS (Should work via API)
# ============================================

# Test memory submission (should work - API uses service role)
curl -X POST https://yoursite.com/api/submit-memory \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "API Test",
    "message": "Testing via API",
    "color": "default",
    "full_bg": true
  }'

# Expected: Should succeed (API uses service role internally)

# Test direct Supabase REST API with anon key (should fail)
curl -X POST https://YOUR_PROJECT.supabase.co/rest/v1/memories \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "Direct Test",
    "message": "Testing direct access",
    "status": "pending"
  }'

# Expected: Should fail with RLS policy violation
```

---

## ✅ Expected Results Summary

### What Should Happen:

| Test | With Anon Key | With Service Role |
|------|---------------|-------------------|
| **SELECT approved memories** | ✅ ALLOWED | ✅ ALLOWED |
| **INSERT memory** | ❌ BLOCKED | ✅ ALLOWED |
| **UPDATE memory** | ❌ BLOCKED | ✅ ALLOWED |
| **DELETE memory** | ❌ BLOCKED | ✅ ALLOWED |
| **Via your API** | ✅ ALLOWED | ✅ ALLOWED |

### Key Indicators RLS is Working:

1. ✅ All tables show `rowsecurity = TRUE`
2. ✅ Policies exist for INSERT/UPDATE/DELETE
3. ✅ Browser console tests with anon key FAIL for writes
4. ✅ Browser console tests with anon key SUCCEED for reads
5. ✅ SQL Editor (service role) can do everything
6. ✅ Your API endpoints work (they use service role internally)

---

## 🚨 Troubleshooting

### If RLS is NOT Working:

1. **Enable RLS on tables:**
   ```sql
   ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
   ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
   ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE unlimited_users ENABLE ROW LEVEL SECURITY;
   ```

2. **Create blocking policies:**
   ```sql
   -- Block all writes with anon key
   CREATE POLICY "Block direct inserts" ON memories 
   FOR INSERT WITH CHECK (false);

   CREATE POLICY "Block direct updates" ON memories 
   FOR UPDATE USING (false);

   CREATE POLICY "Block direct deletes" ON memories 
   FOR DELETE USING (false);

   -- Allow reads
   CREATE POLICY "Allow read approved" ON memories 
   FOR SELECT USING (status = 'approved');
   ```

3. **Check service role key in .env:**
   ```bash
   # Make sure these are set:
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_SERVICE_ROLE_KEY_B=your_service_role_key_b
   ```

---

## 📝 Quick Verification Checklist

Run through this checklist:

- [ ] RLS enabled on all tables (Part 1, Query 1)
- [ ] Policies exist for INSERT/UPDATE/DELETE (Part 1, Query 2)
- [ ] Browser test: INSERT fails with anon key (Part 3, Test 1)
- [ ] Browser test: UPDATE fails with anon key (Part 3, Test 2)
- [ ] Browser test: DELETE fails with anon key (Part 3, Test 3)
- [ ] Browser test: SELECT works with anon key (Part 3, Test 4)
- [ ] Your API `/api/submit-memory` works (Part 5)
- [ ] Same tests pass on Database B

If all checkboxes are ✅, your RLS is **PERFECTLY CONFIGURED!** 🎉

---

## 🎯 Automated Test Script

Want to run all tests automatically? Use this:

```javascript
// Paste this entire script in browser console
async function testRLS(supabaseUrl, supabaseAnonKey) {
  const { createClient } = supabase;
  const client = createClient(supabaseUrl, supabaseAnonKey);
  
  const results = {
    insertBlocked: false,
    updateBlocked: false,
    deleteBlocked: false,
    selectAllowed: false
  };
  
  // Test INSERT
  const { error: insertError } = await client
    .from('memories')
    .insert([{ recipient: 'Test', message: 'Test', status: 'pending' }]);
  results.insertBlocked = !!insertError;
  
  // Test UPDATE
  const { error: updateError } = await client
    .from('memories')
    .update({ status: 'approved' })
    .eq('id', 'fake-id');
  results.updateBlocked = !!updateError;
  
  // Test DELETE
  const { error: deleteError } = await client
    .from('memories')
    .delete()
    .eq('id', 'fake-id');
  results.deleteBlocked = !!deleteError;
  
  // Test SELECT
  const { error: selectError } = await client
    .from('memories')
    .select('*')
    .limit(1);
  results.selectAllowed = !selectError;
  
  // Display results
  console.log('🔒 RLS TEST RESULTS:');
  console.log('===================');
  console.log('INSERT blocked:', results.insertBlocked ? '✅ PASS' : '❌ FAIL');
  console.log('UPDATE blocked:', results.updateBlocked ? '✅ PASS' : '❌ FAIL');
  console.log('DELETE blocked:', results.deleteBlocked ? '✅ PASS' : '❌ FAIL');
  console.log('SELECT allowed:', results.selectAllowed ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = results.insertBlocked && 
                    results.updateBlocked && 
                    results.deleteBlocked && 
                    results.selectAllowed;
  
  console.log('\n' + (allPassed ? '✅ RLS IS WORKING CORRECTLY!' : '❌ RLS HAS ISSUES!'));
  
  return results;
}

// Run the test
testRLS('YOUR_SUPABASE_URL', 'YOUR_ANON_KEY');
```

---

**🎉 Use this guide to verify your RLS is bulletproof!**
