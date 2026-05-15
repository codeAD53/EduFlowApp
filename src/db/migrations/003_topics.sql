CREATE TABLE IF NOT EXISTS topics(
    topicId            SERIAL PRIMARY KEY,
    roadmapId          INTEGER REFERENCES roadmaps(roadmapId) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    week_number         INTEGER,
    order_index         INTEGER,
    created_at          TIMESTAMP DEFAULT NOW()
);
