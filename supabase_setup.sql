-- Execute this entire file in your Supabase SQL Editor once:
-- (Go to https://supabase.com -> Select Project -> SQL Editor -> Paste & Run)

-- 1. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text,
  text text NOT NULL,
  rating integer NOT NULL,
  date date NOT NULL,
  helpful integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public reviews are viewable by everyone."
  ON public.reviews FOR SELECT
  USING (true);

-- Allow public insert access
CREATE POLICY "Anyone can submit a review."
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Allow update access (for helpful counts)
CREATE POLICY "Anyone can update helpful count."
  ON public.reviews FOR UPDATE
  USING (true);

-- Allow delete access (for Admin deletion)
CREATE POLICY "Anyone can delete reviews."
  ON public.reviews FOR DELETE
  USING (true);


-- 2. Create Orders Table
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

-- Enable Row Level Security for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public insert access (for client order lead creation)
CREATE POLICY "Anyone can create an order lead."
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Allow select access (so Admin panel can view incoming orders)
CREATE POLICY "Orders are viewable for Admin."
  ON public.orders FOR SELECT
  USING (true);

-- Allow update access (for status updates)
CREATE POLICY "Anyone can update order status."
  ON public.orders FOR UPDATE
  USING (true);
