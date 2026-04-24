-- Migration: Add detailed_description and pricing_model fields
-- Run this in Supabase SQL Editor

ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS pricing_model TEXT;

-- Add index for pricing model filtering
CREATE INDEX IF NOT EXISTS idx_apps_pricing ON apps(pricing_model);

COMMENT ON COLUMN apps.detailed_description IS 'Extended description shown in modal';
COMMENT ON COLUMN apps.pricing_model IS 'Pricing type: free, paid, freemium, etc.';
