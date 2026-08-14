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

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reviews viewable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone submit review" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update helpful" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Admin delete review" ON public.reviews FOR DELETE USING (true);


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

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Admin delete projects" ON public.projects FOR DELETE USING (true);


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

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans viewable by everyone" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Admin insert plans" ON public.plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update plans" ON public.plans FOR UPDATE USING (true);


-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone create order lead" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin update order status" ON public.orders FOR UPDATE USING (true);
