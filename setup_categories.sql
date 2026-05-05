-- Run this in your Supabase SQL Editor to enable full Category Management

CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Categories are readable by everyone." 
ON categories FOR SELECT 
USING (true);

-- Allow admin full access
CREATE POLICY "Admins have full access to categories." 
ON categories FOR ALL 
USING (auth.role() = 'service_role');

-- Seed existing categories from the products table
INSERT INTO categories (name, slug)
SELECT DISTINCT 
  INITCAP(category) as name, 
  category as slug
FROM products
WHERE category IS NOT NULL AND category != ''
ON CONFLICT (slug) DO NOTHING;
