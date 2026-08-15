-- Execute this entire file in your Supabase SQL Editor once:
-- (Go to https://supabase.com -> Select Project -> SQL Editor -> Paste & Run)

-- 1. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  role text,
  text text NOT NULL,
  rating integer NOT NULL,
  date date NOT NULL,
  helpful integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Projects Table (Portfolio Works)
CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  live_url text NOT NULL,
  image text NOT NULL,
  tags text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Pricing Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price text NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  popular boolean DEFAULT false,
  delivery text NOT NULL,
  badge text,
  features jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text UNIQUE,                        -- Friendly client-facing ID e.g. AXN-20250815-7492
  invoice_no text,
  upi_ref text,                                -- 12-digit UPI Reference / UTR Number
  razorpay_order_id text,
  razorpay_payment_id text,
  plan text NOT NULL,
  amount numeric NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  requirements text,
  status text DEFAULT 'pending_payment',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If orders table already exists, run these migration statements if needed:
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_id text UNIQUE;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS upi_ref text;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_no text;

-- DISABLE RLS on all 4 tables so client operations succeed without permission errors
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Grant Full Access to public API roles
GRANT ALL ON public.reviews TO anon, authenticated, postgres, service_role;
GRANT ALL ON public.projects TO anon, authenticated, postgres, service_role;
GRANT ALL ON public.plans TO anon, authenticated, postgres, service_role;
GRANT ALL ON public.orders TO anon, authenticated, postgres, service_role;
