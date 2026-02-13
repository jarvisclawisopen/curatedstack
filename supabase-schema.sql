-- ============================================
-- Supabase Database Schema for App Directory
-- ============================================
-- Purpose: Store apps with voting/rating system
-- No auth required for MVP (using fingerprints)
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: apps
-- ============================================
-- Stores all app/website entries with metadata
CREATE TABLE apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    logo_url TEXT,
    screenshot_url TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    upvotes INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_apps_category ON apps(category);
CREATE INDEX idx_apps_featured ON apps(featured);
CREATE INDEX idx_apps_created_at ON apps(created_at DESC);
CREATE INDEX idx_apps_upvotes ON apps(upvotes DESC);

-- GIN index for full-text search on name + description
CREATE INDEX idx_apps_search ON apps USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- GIN index for tag filtering
CREATE INDEX idx_apps_tags ON apps USING gin(tags);

-- ============================================
-- TABLE: votes
-- ============================================
-- Stores user votes (upvotes + star ratings)
-- Uses fingerprint instead of user_id for MVP
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    user_fingerprint TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'rating')),
    rating_value INTEGER CHECK (rating_value IS NULL OR (rating_value >= 1 AND rating_value <= 5)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One vote per app per user per type
    UNIQUE(app_id, user_fingerprint, vote_type)
);

-- Index for faster lookups
CREATE INDEX idx_votes_app_id ON votes(app_id);
CREATE INDEX idx_votes_fingerprint ON votes(user_fingerprint);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read apps (public read)
CREATE POLICY "apps_public_read" ON apps
    FOR SELECT
    USING (true);

-- Policy: Anyone can insert votes (public insert)
CREATE POLICY "votes_public_insert" ON votes
    FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can read votes (for checking if already voted)
CREATE POLICY "votes_public_read" ON votes
    FOR SELECT
    USING (true);

-- ============================================
-- FUNCTIONS: Auto-update app stats
-- ============================================

-- Function to recalculate upvotes
CREATE OR REPLACE FUNCTION update_app_upvotes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE apps
    SET upvotes = (
        SELECT COUNT(*)
        FROM votes
        WHERE app_id = NEW.app_id AND vote_type = 'upvote'
    )
    WHERE id = NEW.app_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate ratings
CREATE OR REPLACE FUNCTION update_app_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE apps
    SET 
        rating_sum = (
            SELECT COALESCE(SUM(rating_value), 0)
            FROM votes
            WHERE app_id = NEW.app_id AND vote_type = 'rating'
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM votes
            WHERE app_id = NEW.app_id AND vote_type = 'rating'
        )
    WHERE id = NEW.app_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update upvotes when vote inserted
CREATE TRIGGER trigger_update_upvotes
AFTER INSERT ON votes
FOR EACH ROW
WHEN (NEW.vote_type = 'upvote')
EXECUTE FUNCTION update_app_upvotes();

-- Trigger: Update ratings when rating inserted
CREATE TRIGGER trigger_update_ratings
AFTER INSERT ON votes
FOR EACH ROW
WHEN (NEW.vote_type = 'rating')
EXECUTE FUNCTION update_app_ratings();

-- ============================================
-- SAMPLE DATA (optional - for testing)
-- ============================================

-- Insert sample apps
INSERT INTO apps (name, description, url, category, tags) VALUES
    ('OpenClaw', 'AI agent platform for automation', 'https://openclaw.ai', 'Development', ARRAY['AI', 'automation', 'dev-tools']),
    ('Supabase', 'Open source Firebase alternative', 'https://supabase.com', 'Development', ARRAY['database', 'backend', 'BaaS']),
    ('Figma', 'Collaborative design tool', 'https://figma.com', 'Design', ARRAY['design', 'prototyping', 'collaboration']);

-- ============================================
-- HELPER VIEWS (optional)
-- ============================================

-- View: Apps with calculated average rating
CREATE VIEW apps_with_ratings AS
SELECT 
    a.*,
    CASE 
        WHEN a.rating_count > 0 THEN ROUND(a.rating_sum::NUMERIC / a.rating_count, 1)
        ELSE 0
    END AS avg_rating
FROM apps a;

-- ============================================
-- QUERIES YOU'LL NEED
-- ============================================

-- Get all apps sorted by upvotes:
-- SELECT * FROM apps ORDER BY upvotes DESC;

-- Search apps by name/description:
-- SELECT * FROM apps WHERE to_tsvector('english', name || ' ' || description) @@ to_tsquery('english', 'search_term');

-- Filter by category:
-- SELECT * FROM apps WHERE category = 'Development';

-- Filter by tag:
-- SELECT * FROM apps WHERE 'AI' = ANY(tags);

-- Check if user already voted:
-- SELECT * FROM votes WHERE app_id = 'uuid-here' AND user_fingerprint = 'fingerprint-here' AND vote_type = 'upvote';

-- Insert upvote (will auto-update app.upvotes via trigger):
-- INSERT INTO votes (app_id, user_fingerprint, vote_type) VALUES ('uuid-here', 'fingerprint-here', 'upvote');

-- Insert rating (will auto-update app.rating_sum/count via trigger):
-- INSERT INTO votes (app_id, user_fingerprint, vote_type, rating_value) VALUES ('uuid-here', 'fingerprint-here', 'rating', 5);
