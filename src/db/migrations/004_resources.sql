CREATE TABLE IF NOT EXISTS resources(
    resourceId          SERIAL PRIMARY KEY,
    topicId             INTEGER REFERENCES topics(topicId) ON DELETE CASCADE,
    url                 TEXT,
    type                VARCHAR(50),
    created_at          TIMESTAMP DEFAULT NOW()
);
