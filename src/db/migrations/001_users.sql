CREATE TABLE IF NOT EXISTS users (
    user_id      SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    password    TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()   
);

-- CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uniq ON users (LOWER(email));  
--  valid fix for case-insensitive uniqueness with VARCHAR.