-- =====================================================
-- HRYSSA API – DATABASE SCHEMA
-- Endanlegt gagnagrunnsskema fyrir verkefnið
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
-- PADDOCKS (GIRÐINGAR)
-- ========================
CREATE TABLE paddocks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_paddock_name_per_owner UNIQUE (owner_id, name)
);


-- ========================
-- STALLIONS (GRAÐHESTAR)
-- ========================
CREATE TABLE stallions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_number TEXT UNIQUE,
    chip_id TEXT UNIQUE,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ========================
-- HORSES (HRYSSUR)
-- ========================
CREATE TABLE horses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_number TEXT,
    chip_id TEXT UNIQUE,
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


-- =====================================================
-- ATHUGASEMDIR / PRÓFANIR (ekki hluti af schema)
-- =====================================================

-- Prófunardæmi:
-- SELECT * FROM users;
-- SELECT * FROM horses;
-- SELECT * FROM paddocks;
-- SELECT * FROM stallions;

-- INSERT INTO stallions (name, owner_id)
-- VALUES ('Test Graðhestur', 1);
