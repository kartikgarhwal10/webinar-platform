export type WebinarStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CLOSED';

export interface Webinar {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string | null;
  date: string; // ISO date string (YYYY-MM-DD)
  start_time: string; // ISO timestamp string
  end_time: string; // ISO timestamp string
  timezone: string;
  duration: string;
  meeting_url: string | null;
  status: WebinarStatus;
  is_registration_open: boolean;
  whatsapp_link: string | null;
  price_general: number;
  price_vip: number;
  created_at: string;
  updated_at: string;
}

export interface Speaker {
  id: string;
  webinar_id: string;
  name: string;
  designation: string;
  company: string | null;
  bio: string;
  image_url: string;
  achievements: string[];
  experience_years: number | null;
  created_at: string;
}

export interface Registration {
  id: string;
  webinar_id: string;
  name: string;
  email: string;
  phone: string;
  profession?: string | null;
  experience?: string | null;
  main_challenge?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  ticket_tier: 'GENERAL' | 'VIP';
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'FREE';
  payment_id?: string | null;
  amount_paid: number;
  registered_at: string;
  attendance_status: 'REGISTERED' | 'ATTENDED' | 'ABSENT';
  created_at: string;
}

export interface Testimonial {
  id: string;
  webinar_id: string;
  name: string;
  designation: string;
  company: string | null;
  image_url: string | null;
  content: string;
  rating: number;
  sort_order: number;
  created_at: string;
}

export interface AgendaItem {
  id: string;
  webinar_id: string;
  title: string;
  description: string;
  duration_minutes: number | null;
  sort_order: number;
  created_at: string;
}

export interface FaqItem {
  id: string;
  webinar_id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

export interface BonusItem {
  id: string;
  webinar_id: string;
  title: string;
  description: string;
  value: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

// Complete rich webinar details object returned to frontend
export interface WebinarDetailsData {
  webinar: Webinar;
  speakers: Speaker[];
  agenda: AgendaItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  bonuses: BonusItem[];
}
