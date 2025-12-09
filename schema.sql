--- Töflur sem ég er búin að gera í pgAdmin


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE paddocks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT
)

CREATE TABLE stallions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_number TEXT,
    chip_id TEXT,
    notes TEXT
)

CREATE TABLE horses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_number TEXT,
    chip_id TEXT,
    owner_id INTEGER REFERENCES users(id),
    current_paddock_id INTEGER REFERENCES paddocks(id),
    current_stallion_id INTEGER REFERENCES stallions(id),
    needs_vet BOOLEAN DEFAULT false,
    scanned BOOLEAN DEFAULT false,
    pregnancy_confirmed BOOLEAN DEFAULT false,
    age INTEGER,
    notes TEXT,
    other_info_1 TEXT,
    other_info_2 TEXT,
    created_at TIMESTAMP DEFAULT NOW()
)
