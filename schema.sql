-- =====================================================
-- HRYSSA API – DATABASE SCHEMA
-- =====================================================

-- ========================
-- USERS
-- ========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- STALLIONS (GRAÐHESTAR)
-- ========================
CREATE TABLE stallions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_number TEXT UNIQUE,
    chip_id TEXT UNIQUE,
    owner_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- PADDOCKS (GIRÐINGAR)
-- ========================
CREATE TABLE paddocks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stallion_id INTEGER REFERENCES stallions(id) ON DELETE SET NULL,
    CONSTRAINT unique_paddock_name_per_owner UNIQUE (owner_id, name)
);

-- ========================
-- HORSES (HRYSSUR)
-- ========================
CREATE TABLE horses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_number TEXT,
    chip_id TEXT UNIQUE,
    owner_name TEXT NOT NULL,
    owner_phone TEXT,
    owner_email TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_paddock_id INTEGER REFERENCES paddocks(id),
    current_stallion_id INTEGER REFERENCES stallions(id),
    needs_vet BOOLEAN DEFAULT false,
    pregnancy_confirmed BOOLEAN DEFAULT false,
    notes TEXT,
    other_info_1 TEXT,
    other_info_2 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Breytingar:

ALTER TABLE horses
ALTER COLUMN owner_name DROP NOT NULL;

ALTER TABLE horses
ALTER COLUMN owner_phone DROP NOT NULL;

ALTER TABLE horses
ALTER COLUMN owner_email DROP NOT NULL;

-- =====================================================
-- ATHUGASEMDIR / PRÓFANIR (ekki hluti af schema)
-- =====================================================

-- DROP TABLE IF EXISTS horses, paddocks, stallions, users CASCADE;

-- SELECT * FROM users;
-- SELECT * FROM horses;
-- SELECT * FROM paddocks;
-- SELECT * FROM stallions;

-- INSERT INTO paddocks (name, owner_id)
-- VALUES ('Próf-girðing', 1);

-- INSERT INTO stallions (name, owner_id)
-- VALUES ('Próf-graðhestur', 1);

-- UPDATE paddocks
-- SET stallion_id = 1
-- WHERE id = 1;
