-- Create users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
    profile_data JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to hash passwords
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(sha256(password::bytea), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Insert a sample admin user for testing (optional)
-- Uncomment the line below to create a test admin account
-- INSERT INTO users (email, password_hash, role) VALUES ('admin@example.com', hash_password('Admin123'), 'admin');

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
-- GRANT USAGE ON SEQUENCE users_id_seq TO authenticated; 