-- Add additional client profile fields
-- This migration adds new fields to the clients table for more comprehensive client information

-- Add new columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'Malaysian';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS employment_status TEXT;

-- Add constraints for the new fields
ALTER TABLE clients ADD CONSTRAINT check_gender CHECK (gender IN ('Male', 'Female', 'Other'));
ALTER TABLE clients ADD CONSTRAINT check_marital_status CHECK (marital_status IN ('Single', 'Married', 'Divorced', 'Widowed'));
ALTER TABLE clients ADD CONSTRAINT check_employment_status CHECK (employment_status IN ('Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'));

-- Update existing records with default values
UPDATE clients SET 
  nationality = 'Malaysian',
  gender = 'Male',
  marital_status = 'Single',
  employment_status = 'Employed'
WHERE nationality IS NULL OR gender IS NULL OR marital_status IS NULL OR employment_status IS NULL; 