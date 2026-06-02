ALTER TABLE roadmaps 
                    ALTER COLUMN user_id SET NOT NULL, 
                    ALTER COLUMN goal SET NOT NULL, 
                    ALTER COLUMN level SET NOT NULL,
                    ALTER COLUMN duration SET NOT NULL;

--enforcing valid level values at DB level (matches app validation)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE c.conname = 'check_valid_level' AND t.relname = 'roadmaps'
    ) THEN
        ALTER TABLE roadmaps ADD CONSTRAINT check_valid_level CHECK (level IN('beginner', 'intermediate', 'advanced')); 
    END IF;
END $$;

DO $$
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE c.conname = 'check_valid_type' AND t.relname = 'resources'
    )
    THEN
        ALTER TABLE resources ADD CONSTRAINT check_valid_type CHECK (type IN('video','article','documentation','excercise'));
    END IF;
END $$;

--Added indexes on Foreign Keys (PostgreSQl does not aut-index FK columns)
CREATE INDEX IF NOT EXISTS idx_roadmap_user_id ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_roadmap_id ON topics(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_resources_topic_id ON resources(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
