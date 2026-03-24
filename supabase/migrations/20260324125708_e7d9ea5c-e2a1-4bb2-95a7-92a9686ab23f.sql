ALTER TABLE public.retreats ADD COLUMN accommodation_image_urls text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.retreats ADD COLUMN dining_image_urls text[] NOT NULL DEFAULT '{}';