-- Execute this entire file in your Supabase SQL Editor

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

-- Turn on Row Level Security for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so anyone can see reviews)
CREATE POLICY "Public reviews are viewable by everyone."
  ON public.reviews FOR SELECT
  USING (true);

-- Allow public insert access (so anyone can submit a review)
CREATE POLICY "Anyone can submit a review."
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Allow public update access (for the helpful counter)
CREATE POLICY "Anyone can update helpful count."
  ON public.reviews FOR UPDATE
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

-- Turn on Row Level Security for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public insert access (so the form can submit the lead)
CREATE POLICY "Anyone can create an order lead."
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Allow update access (so the Razorpay handler can update status to 'paid')
CREATE POLICY "Anyone can update order status on success."
  ON public.orders FOR UPDATE
  USING (true);

-- Restrict SELECT (Only you via the dashboard should see orders)
CREATE POLICY "Orders are private."
  ON public.orders FOR SELECT
  USING (false);
