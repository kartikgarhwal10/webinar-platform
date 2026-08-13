-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Webinars Table
CREATE TABLE IF NOT EXISTS webinars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    duration TEXT NOT NULL,
    meeting_url TEXT,
    status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'LIVE', 'COMPLETED', 'CLOSED')),
    is_registration_open BOOLEAN NOT NULL DEFAULT true,
    whatsapp_link TEXT,
    price_general NUMERIC NOT NULL DEFAULT 0.00,
    price_vip NUMERIC NOT NULL DEFAULT 1499.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for slug search performance
CREATE INDEX IF NOT EXISTS idx_webinars_slug ON webinars(slug);

-- Speakers Table
CREATE TABLE IF NOT EXISTS speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    company TEXT,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    achievements TEXT[] DEFAULT '{}',
    experience_years INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    profession TEXT,
    experience TEXT,
    main_challenge TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    ticket_tier TEXT NOT NULL DEFAULT 'GENERAL' CHECK (ticket_tier IN ('GENERAL', 'VIP')),
    payment_status TEXT NOT NULL DEFAULT 'FREE' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'FREE')),
    payment_id TEXT,
    amount_paid NUMERIC NOT NULL DEFAULT 0.00,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    attendance_status TEXT NOT NULL DEFAULT 'REGISTERED' CHECK (attendance_status IN ('REGISTERED', 'ATTENDED', 'ABSENT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Enforce unique registration per email per webinar
    CONSTRAINT unique_email_per_webinar UNIQUE(webinar_id, email)
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    company TEXT,
    image_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agenda Table
CREATE TABLE IF NOT EXISTS agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INTEGER,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FAQ Table
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bonuses Table
CREATE TABLE IF NOT EXISTS bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    value TEXT NOT NULL,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
