CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uniq ON users (LOWER(email));
--  valid fix for case-insensitive uniqueness with VARCHAR.