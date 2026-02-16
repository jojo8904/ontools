-- Add image_url column to news table (for existing databases)
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;
