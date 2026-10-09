CREATE TABLE IF NOT EXISTS startups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    founded_at DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    funding_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    description TEXT,
    adoption_level VARCHAR(50) NOT NULL CHECK (adoption_level IN ('emerging', 'growing', 'mature', 'declining')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_startups_name ON startups(name);
CREATE INDEX idx_startups_category ON startups(category);
CREATE INDEX idx_technologies_sector ON technologies(sector);
CREATE INDEX idx_technologies_adoption ON technologies(adoption_level);
INSERT INTO startups (name, founded_at, location, category, funding_amount) VALUES
    ('TechStart Alpha', '2020-01-15', 'San Francisco, CA', 'AI/ML', 5000000),
    ('Green Energy Co', '2019-06-20', 'Austin, TX', 'CleanTech', 3500000),
    ('HealthTech Pro', '2021-03-10', 'Boston, MA', 'Healthcare', 8000000);

INSERT INTO technologies (name, sector, description, adoption_level) VALUES
    ('Quantum Computing', 'Computing', 'Advanced computing using quantum mechanics', 'emerging'),
    ('Blockchain', 'FinTech', 'Distributed ledger technology', 'growing'),
    ('5G Networks', 'Telecommunications', 'Fifth generation mobile networks', 'mature');
