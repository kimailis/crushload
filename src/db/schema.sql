-- src/db/schema.sql
-- Corporate Trauma Simulator - Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    stripe_customer_id TEXT
);

-- Table: careers
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tier TEXT CHECK (tier IN ('free', 'paid')) NOT NULL,
    layout_type TEXT CHECK (layout_type IN ('cli', 'sql', 'feed', 'workspace')) NOT NULL
);

-- Table: static_missions
CREATE TABLE static_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    email_sender TEXT,
    email_subject TEXT,
    email_body TEXT,
    tasks JSONB,
    validation_rule TEXT
);

-- Table: user_progress
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
    current_step INT DEFAULT 1,
    state_metrics JSONB,
    UNIQUE (user_id, career_id)
);
