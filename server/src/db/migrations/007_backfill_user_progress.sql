-- Normalize existing status values to lowercase
UPDATE user_progress SET status = LOWER(status) 
WHERE status != LOWER(status);

-- Add CHECK constraint for valid status values
ALTER TABLE user_progress
ADD CONSTRAINT check_valid_status CHECK (status IN ('not_started', 'in_progress', 'completed'));