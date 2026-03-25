ALTER TABLE public.blog_posts ALTER COLUMN content DROP DEFAULT;
ALTER TABLE public.blog_posts ALTER COLUMN content TYPE jsonb USING CASE WHEN content = '' THEN '[]'::jsonb ELSE to_jsonb(content) END;
ALTER TABLE public.blog_posts ALTER COLUMN content SET DEFAULT '[]'::jsonb;