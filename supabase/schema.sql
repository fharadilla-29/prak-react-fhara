-- =====================================================
-- E-Commerce Admin & Member Integration
-- Supabase DDL + RLS Policies
-- =====================================================

-- 1. Table: users
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Member')) DEFAULT 'Member',
    tier TEXT NOT NULL CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')) DEFAULT 'Bronze',
    points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Table: products
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    stock INT NOT NULL CHECK (stock >= 0) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Table: orders
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    total_original NUMERIC NOT NULL,
    discount_applied NUMERIC NOT NULL,
    total_final NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Processing', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Table: order_items
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- Enable RLS on all tables
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper function: is_admin()
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'Admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Users
CREATE POLICY "Allow public read for authentication purposes"
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile"
    ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow Admin full access to users"
    ON public.users FOR ALL USING (public.is_admin());

-- Products
CREATE POLICY "Allow everyone to read products"
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow Admin full access to products"
    ON public.products FOR ALL USING (public.is_admin());

-- Orders
CREATE POLICY "Allow members to read their own orders"
    ON public.orders FOR SELECT USING (auth.uid() = member_id);

CREATE POLICY "Allow members to insert their own orders"
    ON public.orders FOR INSERT WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Allow Admin full access to orders"
    ON public.orders FOR ALL USING (public.is_admin());

-- Order Items
CREATE POLICY "Allow members to read their own order items"
    ON public.order_items FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.member_id = auth.uid()));

CREATE POLICY "Allow members to insert their own order items"
    ON public.order_items FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.member_id = auth.uid()));

CREATE POLICY "Allow Admin full access to order items"
    ON public.order_items FOR ALL USING (public.is_admin());

-- =====================================================
-- Trigger: Auto-create profile on new user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, role, tier, points)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Member'),
        COALESCE(NEW.raw_user_meta_data->>'tier', 'Bronze'),
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Seed: Insert an Admin user (optional)
-- Run this AFTER creating an admin user via Supabase Auth
-- Replace '<ADMIN_USER_UUID>' with the actual UUID from auth.users
-- =====================================================
-- UPDATE public.users SET role = 'Admin' WHERE id = '<ADMIN_USER_UUID>';
