-- Create a function to insert the special open challenge user
CREATE OR REPLACE FUNCTION public.create_open_challenge_user(user_id uuid, username text)
RETURNS void AS $$
BEGIN
  -- Insert directly into profiles table, bypassing the foreign key constraint
  INSERT INTO public.profiles (id, username, updated_at)
  VALUES (user_id, username, now())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_open_challenge_user TO authenticated;
