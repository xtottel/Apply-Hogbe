-- Create pins table
CREATE TABLE IF NOT EXISTS public.pins (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  pin VARCHAR(4) NOT NULL,
  client_reference VARCHAR(50) NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo login data
INSERT INTO public.pins (phone, pin, client_reference, used)
VALUES
  ('0244000001', '1234', 'demo-ref-1', FALSE),
  ('0244000002', '5678', 'demo-ref-2', FALSE);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  pin_id INTEGER NOT NULL REFERENCES public.pins(id),
  form_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);