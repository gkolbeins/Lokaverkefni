--- Töflur sem ég er búin að gera í pgAdmin


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    created_at TIMESTAMPTZ DEFAULT NOW()
)

CREATE TABLE stallions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  is_number TEXT UNIQUE,
  chip_id TEXT UNIQUE,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW())
  
DROP TABLE stallions CASCADE

SELECT * FROM stallions

-- prófun
-- SELECT email, password_hash FROM users;

-- INSERT INTO stallions (name, owner_id)
-- VALUES ('Test Graðhestur', 1);
