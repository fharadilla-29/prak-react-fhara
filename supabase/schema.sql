-- =====================================================
-- E-Commerce CRM Schema - V1
-- Supabase DDL + RLS Policies
-- =====================================================

-- Drop existing tables and types to prevent "already exists" errors
DROP TABLE IF EXISTS public.note CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- 1. ENUM UNTUK MANAJEMEN ROLE
CREATE TYPE user_role AS ENUM ('Admin', 'Member', 'Guest');

-- 2. TABEL USERS (Menampung Profil, Sistem Poin, dan Tier Member)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'Member' NOT NULL,
    points INT DEFAULT 0 NOT NULL,
    tier TEXT DEFAULT 'Bronze' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL PRODUCTS (Katalog CRUD Produk)
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABEL ORDERS (Riwayat Pesanan Pelanggan)
CREATE TYPE order_status AS ENUM ('Pending', 'Success', 'Cancelled');
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    total_amount NUMERIC NOT NULL,
    status order_status DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABEL NOTE (Untuk Keperluan Pelengkap internal)
CREATE TABLE public.note (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_restricted BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Active RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper function: is_admin()
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'Admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Users Table Policies
CREATE POLICY "Allow public read for authentication purposes"
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile"
    ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow Admin full access to users"
    ON public.users FOR ALL USING (public.is_admin());

-- Products Table Policies
CREATE POLICY "Allow everyone to read products"
    ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow Admin full access to products"
    ON public.products FOR ALL USING (public.is_admin());

-- Orders Table Policies
CREATE POLICY "Allow members to read their own orders"
    ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow members to insert their own orders"
    ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow Admin full access to orders"
    ON public.orders FOR ALL USING (public.is_admin());

-- Note Table Policies
CREATE POLICY "Allow users to read their own notes"
    ON public.note FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own notes"
    ON public.note FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update/delete their own notes"
    ON public.note FOR ALL USING (auth.uid() = user_id);

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
        (COALESCE(NEW.raw_user_meta_data->>'role', 'Member'))::user_role,
        COALESCE(NEW.raw_user_meta_data->>'tier', 'Bronze'),
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

