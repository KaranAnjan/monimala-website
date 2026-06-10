-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)

-- Add customer info columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_address text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_pincode text;

-- RLS policies for admin access
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (auth.email() = 'anjankaran246@gmail.com');

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (auth.email() = 'anjankaran246@gmail.com');

CREATE POLICY "Admins can view all order_items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND auth.email() = 'anjankaran246@gmail.com'
    )
  );
