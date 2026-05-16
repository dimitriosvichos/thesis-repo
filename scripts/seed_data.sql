-- =====================================================
-- SEED DATA FOR ATTENDME
-- Run this in Supabase SQL Editor
-- Academic Year: October 2025 - May 2026
-- =====================================================

-- First, let's clean up old class_sessions and attendance (keeping users, courses, enrollments)
DELETE FROM attendance;
DELETE FROM class_sessions;

-- Fix the course_enrollment with null student_id
UPDATE course_enrollments
SET student_id = '37cd639c-1273-46d7-b5d9-8e0bb68ea46a' -- Νίκος Αντωνίου
WHERE student_id IS NULL;

-- Add Νίκος to more courses
INSERT INTO course_enrollments (student_id, course_id) VALUES
  ('37cd639c-1273-46d7-b5d9-8e0bb68ea46a', '47d23548-f7da-4af0-b4f7-afd4e5cacaf1'), -- Νίκος -> Calculus I
  ('37cd639c-1273-46d7-b5d9-8e0bb68ea46a', 'ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9')  -- Νίκος -> Database Systems
ON CONFLICT DO NOTHING;

-- =====================================================
-- CLASS SESSIONS FOR CS101 - Introduction to Programming
-- Teacher: Γίαννης Λιαπέρδος (teacher1)
-- Course ID: 291fcf59-d644-481c-92d5-60ce7d507ba4
-- Schedule: Monday & Wednesday, 09:00-11:00, Room A1
-- =====================================================

INSERT INTO class_sessions (course_id, session_date, start_time, end_time, room_number, status, qr_code) VALUES
-- October 2025
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-06', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-06'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-08', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-08'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-13', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-13'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-15', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-15'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-20', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-20'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-22', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-22'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-27', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-27'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-10-29', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-10-29'),
-- November 2025
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-03', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-03'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-05', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-05'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-10', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-10'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-12', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-12'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-17', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-17'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-19', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-19'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-24', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-24'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-11-26', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-11-26'),
-- December 2025
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-12-01', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-12-01'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-12-03', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-12-03'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-12-08', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-12-08'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-12-10', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-12-10'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-12-15', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-12-15'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2025-12-17', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2025-12-17'),
-- January 2026
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-07', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-07'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-12', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-12'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-14', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-14'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-19', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-19'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-21', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-21'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-26', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-26'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-01-28', '09:00', '11:00', 'Room A1', 'completed', 'CS101_2026-01-28'),
-- February 2026 (TODAY is 2026-01-31, so these are upcoming)
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-02', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-02'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-04', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-04'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-09', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-09'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-11', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-11'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-16', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-16'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-18', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-18'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-23', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-23'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-02-25', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-02-25'),
-- March 2026
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-02', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-02'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-04', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-04'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-09', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-09'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-11', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-11'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-16', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-16'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-18', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-18'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-23', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-23'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-03-30', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-03-30'),
-- April 2026
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-01', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-01'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-06', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-06'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-08', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-08'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-13', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-13'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-15', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-15'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-22', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-22'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-27', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-27'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-04-29', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-04-29'),
-- May 2026
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-04', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-04'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-06', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-06'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-11', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-11'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-13', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-13'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-18', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-18'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-20', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-20'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-25', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-25'),
('291fcf59-d644-481c-92d5-60ce7d507ba4', '2026-05-27', '09:00', '11:00', 'Room A1', 'pending', 'CS101_2026-05-27');

-- =====================================================
-- CLASS SESSIONS FOR CS202 - Database Systems
-- Teacher: Γίαννης Λιαπέρδος (teacher1)
-- Course ID: ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9
-- Schedule: Tuesday & Thursday, 14:00-16:00, Room C3
-- =====================================================

INSERT INTO class_sessions (course_id, session_date, start_time, end_time, room_number, status, qr_code) VALUES
-- October 2025
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-07', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-07'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-09', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-09'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-14', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-14'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-16', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-16'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-21', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-21'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-23', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-23'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-28', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-28'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-10-30', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-10-30'),
-- November 2025
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-04', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-04'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-06', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-06'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-11', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-11'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-13', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-13'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-18', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-18'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-20', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-20'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-25', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-25'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-11-27', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-11-27'),
-- December 2025
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-12-02', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-12-02'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-12-04', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-12-04'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-12-09', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-12-09'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-12-11', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-12-11'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-12-16', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-12-16'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2025-12-18', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2025-12-18'),
-- January 2026
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-06', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-06'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-08', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-08'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-13', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-13'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-15', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-15'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-20', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-20'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-22', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-22'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-27', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-27'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-01-29', '14:00', '16:00', 'Room C3', 'completed', 'CS202_2026-01-29'),
-- February 2026
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-03', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-03'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-05', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-05'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-10', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-10'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-12', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-12'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-17', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-17'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-19', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-19'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-24', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-24'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-02-26', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-02-26'),
-- March 2026
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-03', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-03'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-05', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-05'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-10', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-10'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-12', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-12'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-17', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-17'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-19', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-19'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-24', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-24'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-26', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-26'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-03-31', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-03-31'),
-- April 2026
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-02', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-02'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-07', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-07'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-09', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-09'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-14', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-14'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-16', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-16'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-21', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-21'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-23', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-23'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-28', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-28'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-04-30', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-04-30'),
-- May 2026
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-05', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-05'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-07', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-07'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-12', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-12'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-14', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-14'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-19', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-19'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-21', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-21'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-26', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-26'),
('ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9', '2026-05-28', '14:00', '16:00', 'Room C3', 'pending', 'CS202_2026-05-28');

-- =====================================================
-- CLASS SESSIONS FOR MATH101 - Calculus I
-- Teacher: Μαρία Κωνσταντίνου (teacher2)
-- Course ID: 47d23548-f7da-4af0-b4f7-afd4e5cacaf1
-- Schedule: Wednesday & Friday, 11:30-13:30, Room B2
-- =====================================================

INSERT INTO class_sessions (course_id, session_date, start_time, end_time, room_number, status, qr_code) VALUES
-- October 2025
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-08', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-08'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-10', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-10'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-15', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-15'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-17', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-17'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-22', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-22'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-24', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-24'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-29', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-29'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-10-31', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-10-31'),
-- November 2025
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-05', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-05'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-07', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-07'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-12', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-12'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-14', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-14'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-19', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-19'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-21', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-21'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-26', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-26'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-11-28', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-11-28'),
-- December 2025
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-12-03', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-12-03'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-12-05', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-12-05'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-12-10', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-12-10'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-12-12', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-12-12'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-12-17', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-12-17'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2025-12-19', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2025-12-19'),
-- January 2026
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-07', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-07'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-09', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-09'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-14', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-14'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-16', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-16'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-21', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-21'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-23', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-23'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-28', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-28'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-01-30', '11:30', '13:30', 'Room B2', 'completed', 'MATH101_2026-01-30'),
-- February 2026
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-04', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-04'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-06', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-06'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-11', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-11'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-13', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-13'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-18', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-18'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-20', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-20'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-25', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-25'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-02-27', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-02-27'),
-- March 2026
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-04', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-04'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-06', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-06'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-11', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-11'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-13', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-13'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-18', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-18'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-20', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-20'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-25', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-25'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-03-27', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-03-27'),
-- April 2026
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-01', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-01'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-03', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-03'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-08', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-08'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-10', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-10'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-15', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-15'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-17', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-17'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-22', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-22'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-24', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-24'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-04-29', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-04-29'),
-- May 2026
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-01', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-01'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-06', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-06'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-08', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-08'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-13', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-13'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-15', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-15'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-20', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-20'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-22', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-22'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-27', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-27'),
('47d23548-f7da-4af0-b4f7-afd4e5cacaf1', '2026-05-29', '11:30', '13:30', 'Room B2', 'pending', 'MATH101_2026-05-29');

-- =====================================================
-- ATTENDANCE RECORDS FOR COMPLETED SESSIONS
-- Realistic attendance with some absences
-- =====================================================

-- Get session IDs for attendance (we'll insert attendance for completed sessions)
-- Student: Δημήτρης (2017007) - Good attendance ~85%
-- Student: Νίκος (2017008) - Moderate attendance ~70%

-- Insert attendance for CS101 completed sessions (Δημήτρης - enrolled)
INSERT INTO attendance (class_session_id, student_username, check_in_time)
SELECT id, '2017007', session_date + start_time + interval '5 minutes'
FROM class_sessions
WHERE course_id = '291fcf59-d644-481c-92d5-60ce7d507ba4'
  AND status = 'completed'
  AND random() < 0.85; -- 85% attendance

-- Insert attendance for CS101 completed sessions (Νίκος - enrolled)
INSERT INTO attendance (class_session_id, student_username, check_in_time)
SELECT id, '2017008', session_date + start_time + interval '8 minutes'
FROM class_sessions
WHERE course_id = '291fcf59-d644-481c-92d5-60ce7d507ba4'
  AND status = 'completed'
  AND random() < 0.70; -- 70% attendance

-- Insert attendance for CS202 completed sessions (Δημήτρης - enrolled)
INSERT INTO attendance (class_session_id, student_username, check_in_time)
SELECT id, '2017007', session_date + start_time + interval '3 minutes'
FROM class_sessions
WHERE course_id = 'ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9'
  AND status = 'completed'
  AND random() < 0.90; -- 90% attendance

-- Insert attendance for CS202 completed sessions (Νίκος - enrolled)
INSERT INTO attendance (class_session_id, student_username, check_in_time)
SELECT id, '2017008', session_date + start_time + interval '10 minutes'
FROM class_sessions
WHERE course_id = 'ad8f6cf7-aa50-442a-b49b-cf3ed2f4bea9'
  AND status = 'completed'
  AND random() < 0.65; -- 65% attendance

-- Insert attendance for MATH101 completed sessions (Δημήτρης - enrolled)
INSERT INTO attendance (class_session_id, student_username, check_in_time)
SELECT id, '2017007', session_date + start_time + interval '2 minutes'
FROM class_sessions
WHERE course_id = '47d23548-f7da-4af0-b4f7-afd4e5cacaf1'
  AND status = 'completed'
  AND random() < 0.80; -- 80% attendance

-- Insert attendance for MATH101 completed sessions (Νίκος - enrolled)
INSERT INTO attendance (class_session_id, student_username, check_in_time)
SELECT id, '2017008', session_date + start_time + interval '12 minutes'
FROM class_sessions
WHERE course_id = '47d23548-f7da-4af0-b4f7-afd4e5cacaf1'
  AND status = 'completed'
  AND random() < 0.75; -- 75% attendance

-- =====================================================
-- SUMMARY
-- =====================================================
-- Total class sessions: ~180 (60 per course, 3 courses)
-- Period: October 2025 - May 2026
-- Completed sessions: Oct 2025 - Jan 2026
-- Pending sessions: Feb 2026 - May 2026
--
-- CS101: Mon & Wed 09:00-11:00, Room A1 (Teacher: Γίαννης)
-- CS202: Tue & Thu 14:00-16:00, Room C3 (Teacher: Γίαννης)
-- MATH101: Wed & Fri 11:30-13:30, Room B2 (Teacher: Μαρία)
-- =====================================================

SELECT 'Seed completed!' as message,
       (SELECT count(*) FROM class_sessions) as total_sessions,
       (SELECT count(*) FROM class_sessions WHERE status = 'completed') as completed_sessions,
       (SELECT count(*) FROM class_sessions WHERE status = 'pending') as pending_sessions,
       (SELECT count(*) FROM attendance) as total_attendance_records;
