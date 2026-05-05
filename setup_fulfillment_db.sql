-- Run this in your Supabase SQL Editor to enable fulfillment settings per product

-- Add allowed fulfillment methods as a text array, default to all methods available
ALTER TABLE products ADD COLUMN IF NOT EXISTS allowed_fulfillment_methods text[] DEFAULT '{pickup,local_delivery,extended_delivery,west_coast_shipping,nationwide_shipping}';

-- Add fulfillment minimums as a JSONB object, default to empty object
ALTER TABLE products ADD COLUMN IF NOT EXISTS fulfillment_minimums jsonb DEFAULT '{}'::jsonb;

-- Optional: If you want to enforce that ice cream is only available for pickup and local_delivery
UPDATE products 
SET allowed_fulfillment_methods = '{pickup,local_delivery}' 
WHERE category = 'icecream';
