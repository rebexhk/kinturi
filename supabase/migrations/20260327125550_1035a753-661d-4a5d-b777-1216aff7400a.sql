-- Convert type from text to text[] 
ALTER TABLE public.retreats 
  ALTER COLUMN type SET DATA TYPE text[] USING ARRAY[type],
  ALTER COLUMN type SET DEFAULT '{}'::text[];

-- Drop categories column
ALTER TABLE public.retreats DROP COLUMN IF EXISTS categories;