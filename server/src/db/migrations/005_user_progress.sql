CREATE TABLE IF NOT EXISTS user_progress(
    user_progress_id            SERIAL PRIMARY KEY,
    user_id                     INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    topic_id                    INTEGER REFERENCES topics(topic_id) ON DELETE CASCADE,
    status                      VARCHAR(50) DEFAULT 'NOT_STARTED',
    updated_at                  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
)