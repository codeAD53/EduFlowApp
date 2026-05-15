CREATE TABLE IF NOT EXISTS roadmaps(
    roadmapId           SERIAL PRIMARY KEY,
    userId              INTEGER REFERENCES users(userId) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    goal                TEXT,
    level               VARCHAR(50),
    duration            VARCHAR(50),
    is_Completed        BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT NOW()
);