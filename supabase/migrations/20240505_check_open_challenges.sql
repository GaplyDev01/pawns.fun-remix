-- This script checks for any challenges with NULL challenged_id
-- and reports how many would need to be updated

SELECT COUNT(*) AS challenges_with_null_challenged_id 
FROM challenges 
WHERE challenged_id IS NULL;

-- Check if the open_challenge user exists
SELECT id, username, created_at 
FROM profiles 
WHERE username = 'open_challenge';

-- Show all challenges that would be considered "open challenges"
-- after the migration (for verification)
SELECT c.id, c.challenger_id, c.challenged_id, c.status, c.created_at,
       p.username AS challenger_username
FROM challenges c
JOIN profiles p ON c.challenger_id = p.id
WHERE c.challenged_id IS NULL
   OR c.challenged_id IN (SELECT id FROM profiles WHERE username = 'open_challenge')
ORDER BY c.created_at DESC
LIMIT 10;
