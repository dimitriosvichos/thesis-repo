-- =====================================================
-- ADD NEW COLUMNS TO COURSES TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add new columns to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 6,
ADD COLUMN IF NOT EXISTS schedule_info TEXT;

-- Update existing courses with sample data
UPDATE courses
SET
    description = 'Εισαγωγή στον προγραμματισμό με Python. Μεταβλητές, συναρτήσεις, δομές δεδομένων και αλγόριθμοι.',
    credits = 6,
    schedule_info = 'Δευτέρα & Τετάρτη 09:00-11:00'
WHERE course_code = 'CS101';

UPDATE courses
SET
    description = 'Θεμελιώδεις έννοιες του απειροστικού λογισμού. Όρια, παράγωγοι και ολοκληρώματα.',
    credits = 6,
    schedule_info = 'Τρίτη & Πέμπτη 11:00-13:00'
WHERE course_code = 'MATH101';

UPDATE courses
SET
    description = 'Σχεδιασμός και διαχείριση σχεσιακών βάσεων δεδομένων. SQL, κανονικοποίηση και ευρετήρια.',
    credits = 5,
    schedule_info = 'Παρασκευή 14:00-17:00'
WHERE course_code = 'CS201';
