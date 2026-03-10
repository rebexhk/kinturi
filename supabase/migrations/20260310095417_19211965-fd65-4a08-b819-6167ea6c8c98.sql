
-- Create retreats table with full CMS fields
CREATE TABLE public.retreats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  location TEXT NOT NULL,
  address TEXT,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  group_size TEXT,
  level TEXT,
  dates JSONB DEFAULT '[]'::jsonb,
  instructor JSONB DEFAULT '{}'::jsonb,
  accommodation JSONB DEFAULT '{}'::jsonb,
  inclusions TEXT[] DEFAULT '{}',
  not_included TEXT[] DEFAULT '{}',
  menu JSONB DEFAULT '{}'::jsonb,
  facilities TEXT[] DEFAULT '{}',
  schedule JSONB DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  gallery_image_urls TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.retreats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published retreats"
  ON public.retreats FOR SELECT
  USING (status = 'published');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_retreats_updated_at
  BEFORE UPDATE ON public.retreats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('retreat-images', 'retreat-images', true);

CREATE POLICY "Retreat images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'retreat-images');

CREATE POLICY "Allow uploads to retreat images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'retreat-images');

CREATE POLICY "Allow updates to retreat images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'retreat-images');

CREATE POLICY "Allow deletes from retreat images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'retreat-images');
