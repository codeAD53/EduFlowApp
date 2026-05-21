CREATE TABLE IF NOT EXISTS resources(
    resource_id          SERIAL PRIMARY KEY,
    topic_id             INTEGER REFERENCES topics(topic_id) ON DELETE CASCADE,
    title               VARCHAR(255),
    url                 TEXT,
    type                VARCHAR(50),
    created_at          TIMESTAMP DEFAULT NOW()
);
