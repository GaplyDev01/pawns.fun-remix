-- This migration handles existing open challenges by:
-- 1. Creating a special "open_challenge" user if it doesn't exist
-- 2. Updating any challenges with null challenged_id to use this special user

-- Start a transaction to ensure data integrity
BEGIN;

-- Create a UUID for the open_challenge user if it doesn't exist
DO $$
DECLARE
    open_challenge_id UUID;
BEGIN
    -- Check if the open_challenge user already exists
    SELECT id INTO open_challenge_id FROM profiles WHERE username = 'open_challenge';
    
    -- If it doesn't exist, create it
    IF open_challenge_id IS NULL THEN
        open_challenge_id := gen_random_uuid();
        
        INSERT INTO profiles (
            id, 
            username, 
            created_at, 
            updated_at, 
            elo_rating, 
            games_played, 
            games_won, 
            games_lost, 
            games_drawn, 
            last_online,
            is_admin,
            is_banned
        ) VALUES (
            open_challenge_id, 
            'open_challenge', 
            NOW(), 
            NOW(), 
            1200, -- Default rating
            0, -- No games played
            0, -- No games won
            0, -- No games lost
            0, -- No games drawn
            NOW(), -- Last online is now
            false, -- Not an admin
            false -- Not banned
        );
        
        RAISE NOTICE 'Created open_challenge user with ID: %', open_challenge_id;
    ELSE
        RAISE NOTICE 'open_challenge user already exists with ID: %', open_challenge_id;
    END IF;
    
    -- Update any existing challenges that have NULL challenged_id
    -- Note: This assumes your database allows NULL values temporarily or that you've already
    -- made challenged_id nullable in a previous migration
    UPDATE challenges 
    SET challenged_id = open_challenge_id 
    WHERE challenged_id IS NULL;
    
    -- Count how many challenges were updated
    RAISE NOTICE 'Updated % challenges to use the open_challenge user', 
        (SELECT COUNT(*) FROM challenges WHERE challenged_id = open_challenge_id);
END $$;

-- Commit the transaction
COMMIT;
