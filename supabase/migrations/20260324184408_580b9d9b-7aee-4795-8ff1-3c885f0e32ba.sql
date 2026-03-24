
ALTER TABLE public.retreats
  ADD COLUMN IF NOT EXISTS hero_image_alt text DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery_image_alts text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS accommodation_image_alts text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS dining_image_alts text[] DEFAULT '{}'::text[];
