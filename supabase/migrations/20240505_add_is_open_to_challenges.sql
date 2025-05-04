-- Add is_open column to challenges table
ALTER TABLE public.challenges ADD COLUMN is_open BOOLEAN DEFAULT FALSE;

-- Add an index on is_open to improve query performance
CREATE INDEX IF NOT EXISTS challenges_is_open_idx ON public.challenges (is_open);

-- Add a comment to explain the meaning of is_open
COMMENT ON COLUMN public.challenges.is_open IS 'TRUE indicates an open challenge that can be accepted by any user';

-- Make challenged_id nullable
ALTER TABLE public.challenges ALTER COLUMN challenged_id DROP NOT NULL;
