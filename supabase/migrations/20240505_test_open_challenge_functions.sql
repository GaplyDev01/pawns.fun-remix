-- This script tests the open challenge functions
-- Note: This is for testing only and should not be run in production

-- Get the open challenge user ID
SELECT get_open_challenge_user_id() AS open_challenge_user_id;

-- Test with a sample user and game
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- Replace with a real user ID for testing
    test_game_id UUID := '00000000-0000-0000-0000-000000000002'; -- Replace with a real game ID for testing
    new_challenge_id UUID;
BEGIN
    -- Create a test open challenge
    SELECT create_open_challenge(test_user_id, test_game_id) INTO new_challenge_id;
    
    RAISE NOTICE 'Created test open challenge with ID: %', new_challenge_id;
    
    -- Check if it's recognized as an open challenge
    IF is_open_challenge(new_challenge_id) THEN
        RAISE NOTICE 'Successfully verified as an open challenge';
    ELSE
        RAISE NOTICE 'Failed to verify as an open challenge';
    END IF;
    
    -- Clean up the test challenge
    DELETE FROM challenges WHERE id = new_challenge_id;
END $$;
