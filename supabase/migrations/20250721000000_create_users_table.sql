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

-- Create function to hash passwords (we'll use this in the application)
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In a real application, you would use a proper hashing library
    -- For now, we'll use a simple hash function
    -- In production, use bcrypt or similar
    RETURN encode(sha256(password::bytea), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Insert some sample users for testing (optional)
-- INSERT INTO users (email, password_hash, role) VALUES 
-- ('admin@example.com', hash_password('Admin123'), 'admin'),
-- ('user@example.com', hash_password('User123'), 'user');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT USAGE ON SEQUENCE users_id_seq TO authenticated; 