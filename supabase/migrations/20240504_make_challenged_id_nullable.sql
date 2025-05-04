-- Make challenged_id nullable in challenges table
ALTER TABLE public.challenges ALTER COLUMN challenged_id DROP NOT NULL;

-- Add an index on challenged_id to improve query performance
CREATE INDEX IF NOT EXISTS challenges_challenged_id_idx ON public.challenges (challenged_id);

-- Add a comment to explain the meaning of NULL in challenged_id
COMMENT ON COLUMN public.challenges.challenged_id IS 'NULL value indicates an open challenge that can be accepted by any user';
