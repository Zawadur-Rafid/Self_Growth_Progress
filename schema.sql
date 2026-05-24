-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS self_growth_tracker;
USE self_growth_tracker;

-- Create the skills table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_date DATE NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    notes TEXT,
    status ENUM('active', 'completed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);

-- Optional: Index on status for faster filtering
CREATE INDEX idx_status ON skills(status);

-- Optional: Seed with a sample skill
-- INSERT INTO skills (id, name, category, target_date, progress, notes, status, created_at)
-- VALUES ('sample1', 'Learn Spanish', 'language', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 12, 'Daily 20m practice', 'active', NOW());
