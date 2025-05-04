-- This migration creates helper functions for working with open challenges

-- Function to get the open_challenge user ID
CREATE OR REPLACE FUNCTION get_open_challenge_user_id()
RETURNS UUID AS $$
DECLARE
    open_challenge_id UUID;
BEGIN
    -- Check if the open_challenge user exists
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
    END IF;
    
    RETURN open_challenge_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a challenge is an open challenge
CREATE OR REPLACE FUNCTION is_open_challenge(challenge_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    open_challenge_user_id UUID;
    challenge_recipient_id UUID;
BEGIN
    -- Get the open challenge user ID
    SELECT get_open_challenge_user_id() INTO open_challenge_user_id;
    
    -- Get the challenged_id for this challenge
    SELECT challenged_id INTO challenge_recipient_id 
    FROM challenges 
    WHERE id = challenge_id;
    
    -- Return true if this challenge is directed to the open_challenge user
    RETURN challenge_recipient_id = open_challenge_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create an open challenge
CREATE OR REPLACE FUNCTION create_open_challenge(
    p_challenger_id UUID,
    p_game_id UUID,
    p_game_mode_id INTEGER DEFAULT 1,
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
)
RETURNS UUID AS $$
DECLARE
    open_challenge_user_id UUID;
    new_challenge_id UUID;
BEGIN
    -- Get the open challenge user ID
    SELECT get_open_challenge_user_id() INTO open_challenge_user_id;
    
    -- Generate a new UUID for the challenge
    new_challenge_id := gen_random_uuid();
    
    -- Create the challenge
    INSERT INTO challenges (
        id,
        challenger_id,
        challenged_id,
        status,
        game_id,
        game_mode_id,
        expires_at,
        created_at,
        updated_at
    ) VALUES (
        new_challenge_id,
        p_challenger_id,
        open_challenge_user_id,
        'pending',
        p_game_id,
        p_game_mode_id,
        p_expires_at,
        NOW(),
        NOW()
    );
    
    RETURN new_challenge_id;
END;
$$ LANGUAGE plpgsql;

-- Comment on functions
COMMENT ON FUNCTION get_open_challenge_user_id() IS 'Returns the ID of the special open_challenge user, creating it if needed';
COMMENT ON FUNCTION is_open_challenge(UUID) IS 'Checks if a challenge is an open challenge (available to anyone)';
COMMENT ON FUNCTION create_open_challenge(UUID, UUID, INTEGER, TIMESTAMP WITH TIME ZONE) IS 'Creates an open challenge that can be accepted by anyone';
