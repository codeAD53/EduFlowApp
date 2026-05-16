CREATE TABLE IF NOT EXISTS topics(
    topic_id            SERIAL PRIMARY KEY,
    roadmap_id          INTEGER REFERENCES roadmaps(roadmap_id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    week_number         INTEGER,
    order_index         INTEGER,
    created_at          TIMESTAMP DEFAULT NOW()
);
