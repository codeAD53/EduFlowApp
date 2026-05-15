CREATE TABLE IF NOT EXISTS user_progress(
    user_progress_id            SERIAL PRIMARY KEY,
    userId                     INTEGER REFERENCES users(userId) ON DELETE CASCADE,
    topicId                    INTEGER REFERENCES topics(topicId) ON DELETE CASCADE,
    status                      VARCHAR(50) DEFAULT 'NOT_STARTED',
    updated_at                  TIMESTAMP DEFAULT NOW(),
    UNIQUE(userId, topicId)
)