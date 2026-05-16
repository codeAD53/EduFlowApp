CREATE TABLE IF NOT EXISTS roadmaps(
    roadmap_id           SERIAL PRIMARY KEY,
    user_id              INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    goal                TEXT,
    level               VARCHAR(50),
    duration            VARCHAR(50),
    is_completed        BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT NOW()
);