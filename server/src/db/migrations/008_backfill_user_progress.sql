-- Set NULL statuses to default 'not_started'
UPDATE user_progress SET status = 'not_started' WHERE status IS NULL;

-- Normalize existing status values to lowercase
UPDATE user_progress SET status = LOWER(status)
WHERE status IS NOT NULL AND status != LOWER(status);

-- Validate that all statuses are valid before adding constraint
DO $$
DECLARE
    invalid_count INT;
BEGIN
    SELECT COUNT(*) INTO invalid_count
    FROM user_progress
    WHERE status IS NULL OR status NOT IN ('not_started', 'in_progress', 'completed');
    
    IF invalid_count > 0 THEN
        RAISE EXCEPTION 'Cannot add check_valid_status constraint: found % rows with NULL or invalid status values. Valid values are: not_started, in_progress, completed', invalid_count;
    END IF;
END $$;

-- Ensure future rows use the correct default and enforce NOT NULL/valid values
ALTER TABLE user_progress
ALTER COLUMN status SET DEFAULT 'not_started',
ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE c.conname = 'check_valid_status'
          AND t.relname = 'user_progress'
    ) THEN
        EXECUTE 'ALTER TABLE user_progress ADD CONSTRAINT check_valid_status CHECK (status IN (''not_started'', ''in_progress'', ''completed''))';
    END IF;
END $$;