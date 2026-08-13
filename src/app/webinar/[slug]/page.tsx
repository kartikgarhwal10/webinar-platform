import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { WebinarDetailsData } from "@/types/webinar";

// Import layout and UI sections
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import WebinarDetails from "@/components/sections/WebinarDetails";
import TrustStats from "@/components/sections/TrustStats";
import ProblemSection from "@/components/sections/ProblemSection";
import LearningOutcomes from "@/components/sections/LearningOutcomes";
import Benefits from "@/components/sections/Benefits";
import WebinarExperience from "@/components/sections/WebinarExperience";
import Speaker from "@/components/sections/Speaker";
import Agenda from "@/components/sections/Agenda";
import Bonuses from "@/components/sections/Bonuses";
import Testimonials from "@/components/sections/Testimonials";
import Registration from "@/components/sections/Registration";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Static mock data fallback for immediate local testing and preview.
 * Satisfies multi-webinar routing (?utm_source=... UTM tracking, states, etc.)
 */
const MOCK_WEBINARS: Record<string, WebinarDetailsData> = {
  "digital-growth": {
    webinar: {
      id: "11111111-1111-1111-1111-111111111111",
      slug: "digital-growth",
      title: "Scale Your Frontend: Next.js + Cloudflare + Supabase Masterclass",
      subtitle: "Learn how to architect, build, and deploy premium, conversion-focused web apps to the Cloudflare Workers Edge network with real-time relational databases.",
      description: "Join us live as we build a fully dynamic Next.js application, implement schema relationships in Supabase PostgreSQL, set up edge caching, and deploy using OpenNext and Wrangler.",
      date: "August 20, 2026",
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in the future for countdown validation
      end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
      timezone: "Asia/Kolkata",
      duration: "90 Mins",
      meeting_url: "https://zoom.us/j/123456789",
      status: "UPCOMING",
      is_registration_open: true,
      whatsapp_link: "https://chat.whatsapp.com/dummy-group-digital-growth",
      price_general: 0.00,
      price_vip: 1499.00,
      created_at: "2026-08-13T12:00:00Z",
      updated_at: "2026-08-13T12:00:00Z",
    },
    speakers: [
      {
        id: "22222222-2222-2222-2222-222222222222",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        name: "Arjun Mehta",
        designation: "Principal Frontend Architect",
        company: "Veloce Technologies",
        bio: "Arjun has spent over a decade leading frontend infrastructure teams. He specializes in React Core, Edge compute networks, and database optimization techniques for scaling SaaS products.",
        image_url: "",
        achievements: ["Former Lead Dev at Netflix", "Authored react-edge-router library", "Mentored 10,000+ engineers"],
        experience_years: 12,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    agenda: [
      {
        id: "33333333-3333-3333-3333-333333333331",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        title: "Introduction & Edge Core Concepts",
        description: "Why Vercel is not your only choice. Understanding Cloudflare Workers, OpenNext compilation targets, and edge networking architectures.",
        duration_minutes: 15,
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "33333333-3333-3333-3333-333333333332",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        title: "Supabase Schema & Security Setup",
        description: "Modeling the database for speed. Writing secure PostgreSQL tables, setting Row Level Security (RLS) policies, and connection limits.",
        duration_minutes: 25,
        sort_order: 2,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        title: "Live Application Assembly & Logic",
        description: "Writing React Server Components, validating inputs with Zod, handling forms with React Hook Form, and writing Workers-compatible server code.",
        duration_minutes: 30,
        sort_order: 3,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "33333333-3333-3333-3333-333333333334",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        title: "Deployment & Optimization Audit",
        description: "Deploying live using Wrangler CLI. Inspecting Lighthouse scores, validating Core Web Vitals, and debugging common edge error states.",
        duration_minutes: 20,
        sort_order: 4,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    testimonials: [
      {
        id: "44444444-4444-4444-4444-444444444441",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        name: "Vikram Sen",
        designation: "Senior Software Engineer",
        company: "Razorpay",
        image_url: null,
        content: "Arjun's session changed how I think about frontend deployment. We moved our main portal to Cloudflare Workers and saved 70% on hosting bills while decreasing LCP.",
        rating: 5,
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "44444444-4444-4444-4444-444444444442",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        name: "Neha Sharma",
        designation: "Tech Lead",
        company: "Paytm",
        image_url: null,
        content: "The Zod server validation and Supabase setup walkthrough was incredibly detailed. Usually, tutorials skip the database part, but here it was front and center.",
        rating: 5,
        sort_order: 2,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "44444444-4444-4444-4444-444444444443",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        name: "Rohit Verma",
        designation: "Founder",
        company: "ScribeAI",
        image_url: null,
        content: "As a founder, I need high performance and minimal cost. Deploying Next.js on Cloudflare via OpenNext is the holy grail. Highly recommended class!",
        rating: 5,
        sort_order: 3,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    faqs: [
      {
        id: "55555555-5555-5555-5555-555555555551",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        question: "Is the webinar free?",
        answer: "Yes, the live masterclass is 100% free to attend. Registration is required to secure your seat and receive resource templates.",
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "55555555-5555-5555-5555-555555555552",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        question: "Will I receive the recording?",
        answer: "Replays are sent to registered attendees only, but we highly recommend attending live so you can participate in the Q&A session.",
        sort_order: 2,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "55555555-5555-5555-5555-555555555553",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        question: "Do I need experience with Cloudflare?",
        answer: "Basic knowledge of React and JavaScript is expected. We will explain OpenNext, Wrangler, and Workers configurations from scratch.",
        sort_order: 3,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    bonuses: [
      {
        id: "66666666-6666-6666-6666-666666666661",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        title: "Next.js + Cloudflare Starter Boilerplate",
        description: "Pre-configured Next.js template with OpenNext setup, TypeScript schema interfaces, Tailwind CSS tokens, and ESLint configurations.",
        value: "₹4,999",
        image_url: null,
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "66666666-6666-6666-6666-666666666662",
        webinar_id: "11111111-1111-1111-1111-111111111111",
        title: "Supabase Relational Database Setup Scripts",
        description: "Full SQL scripts to bootstrap your tables, define foreign key constraints, populate lookup values, and set up secure RLS rules.",
        value: "₹2,499",
        image_url: null,
        sort_order: 2,
        created_at: "2026-08-13T12:00:00Z"
      }
    ]
  },
  "ai-masterclass": {
    webinar: {
      id: "77777777-7777-7777-7777-777777777777",
      slug: "ai-masterclass",
      title: "AI Integration: Building Intelligent Apps with Next.js & Gemini",
      subtitle: "Master the patterns to build AI-augmented features, prompt engineering interfaces, streaming text generation, and dynamic UI layouts in Next.js.",
      description: "Discover how to orchestrate Gemini API calls on edge runtimes, manage vector configurations, and style high-performance AI interfaces.",
      date: "August 24, 2026",
      start_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
      timezone: "Asia/Kolkata",
      duration: "90 Mins",
      meeting_url: "https://zoom.us/j/987654321",
      status: "UPCOMING",
      is_registration_open: true,
      whatsapp_link: "https://chat.whatsapp.com/dummy-group-ai-masterclass",
      price_general: 0.00,
      price_vip: 1499.00,
      created_at: "2026-08-13T12:00:00Z",
      updated_at: "2026-08-13T12:00:00Z",
    },
    speakers: [
      {
        id: "22222222-2222-2222-2222-222222222223",
        webinar_id: "77777777-7777-7777-7777-777777777777",
        name: "Dr. Elena Rostov",
        designation: "Lead AI Researcher",
        company: "Cognitive Labs",
        bio: "Elena Rostov is a developer advocate and AI architect who previously worked on Gemini integration frameworks. She focuses on low-latency user interfaces.",
        image_url: "",
        achievements: ["Former Staff Researcher at Google", "Ph.D. in Machine Learning", "Creator of generative-ui npm package"],
        experience_years: 10,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    agenda: [
      {
        id: "33333333-3333-3333-3333-333333333341",
        webinar_id: "77777777-7777-7777-7777-777777777777",
        title: "Introduction to Generative UI",
        description: "Moving beyond basic markdown responses. How to stream rich React UI templates straight from AI nodes.",
        duration_minutes: 20,
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      },
      {
        id: "33333333-3333-3333-3333-333333333342",
        webinar_id: "77777777-7777-7777-7777-777777777777",
        title: "Gemini API Edge Architecture",
        description: "Making sub-second completions by calling Gemini from Cloudflare Workers without proxy servers.",
        duration_minutes: 25,
        sort_order: 2,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    testimonials: [
      {
        id: "44444444-4444-4444-4444-444444444451",
        webinar_id: "77777777-7777-7777-7777-777777777777",
        name: "Devin Foster",
        designation: "AI Engineer",
        company: "Stripe",
        image_url: null,
        content: "Elena's guide to streaming UI components was excellent. We applied it directly to our prompt dashboards.",
        rating: 5,
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    faqs: [
      {
        id: "55555555-5555-5555-5555-555555555561",
        webinar_id: "77777777-7777-7777-7777-777777777777",
        question: "Do I need a paid Gemini API Key?",
        answer: "No, we will demonstrate using Google AI Studio's free tier keys for local and sandbox development.",
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      }
    ],
    bonuses: [
      {
        id: "66666666-6666-6666-6666-666666666671",
        webinar_id: "77777777-7777-7777-7777-777777777777",
        title: "Gemini Streaming UI Helper Library",
        description: "Ready-to-use utility hooks to parse Server Sent Events (SSE) and translate them into typed React nodes.",
        value: "₹3,999",
        image_url: null,
        sort_order: 1,
        created_at: "2026-08-13T12:00:00Z"
      }
    ]
  }
};

/**
 * Fetch webinar data from Supabase. Falls back to MOCK_WEBINARS if db check fails or returns empty.
 */
async function getWebinarData(slug: string): Promise<WebinarDetailsData | null> {
  try {
    // 1. Fetch webinar info
    const { data: webinar, error: webError } = await supabase
      .from("webinars")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (webError || !webinar) {
      // Return mock fallback if configured
      return MOCK_WEBINARS[slug] || null;
    }

    // 2. Fetch related details in parallel
    const [speakersRes, agendaRes, testimonialsRes, faqsRes, bonusesRes] = await Promise.all([
      supabase.from("speakers").select("*").eq("webinar_id", webinar.id),
      supabase.from("agenda").select("*").eq("webinar_id", webinar.id),
      supabase.from("testimonials").select("*").eq("webinar_id", webinar.id),
      supabase.from("faq").select("*").eq("webinar_id", webinar.id),
      supabase.from("bonuses").select("*").eq("webinar_id", webinar.id),
    ]);

    return {
      webinar,
      speakers: speakersRes.data || [],
      agenda: agendaRes.data || [],
      testimonials: testimonialsRes.data || [],
      faqs: faqsRes.data || [],
      bonuses: bonusesRes.data || [],
    };
  } catch (err) {
    console.warn(`[Supabase Fetch Fallback] Active fallback to mock data for slug: ${slug}`);
    return MOCK_WEBINARS[slug] || null;
  }
}

/**
 * Dynamic SEO Generation
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getWebinarData(resolvedParams.slug);
  
  if (!data) {
    return {
      title: "Webinar Page",
      description: "Secure your seat for the upcoming masterclass.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: `${data.webinar.title} | WeMeet`,
    description: data.webinar.subtitle,
    alternates: {
      canonical: `${siteUrl}/webinar/${resolvedParams.slug}`,
    },
    openGraph: {
      title: data.webinar.title,
      description: data.webinar.subtitle,
      url: `${siteUrl}/webinar/${resolvedParams.slug}`,
      type: "website",
      siteName: "WeMeet",
    },
    twitter: {
      card: "summary_large_image",
      title: data.webinar.title,
      description: data.webinar.subtitle,
    }
  };
}

export default async function WebinarPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getWebinarData(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  const { webinar, speakers, agenda, testimonials, faqs, bonuses } = data;
  
  // Format dates for display
  const dateFormatted = new Date(webinar.start_time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: webinar.timezone,
  });

  const timeFormatted = new Date(webinar.start_time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: webinar.timezone,
  });

  const defaultSpeaker = speakers[0] || {
    name: "Expert Host",
    designation: "Technical Lead",
    company: "",
    bio: "Experienced developer and instructor.",
    achievements: [],
    experience_years: 5,
    image_url: ""
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar webinarTitle={webinar.title} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          webinarId={webinar.id}
          title={webinar.title}
          subtitle={webinar.subtitle}
          dateText={dateFormatted}
          timeText={timeFormatted}
          duration={webinar.duration}
          speakerName={defaultSpeaker.name}
          speakerImage={defaultSpeaker.image_url}
          speakerDesignation={defaultSpeaker.designation}
        />

        {/* Technical details parameters strip */}
        <WebinarDetails
          dateText={dateFormatted}
          timeText={timeFormatted}
          duration={webinar.duration}
          timezone={webinar.timezone}
        />

        {/* Stats and credentials */}
        <TrustStats />

        {/* Problems Card Block */}
        <ProblemSection webinarTopic={resolvedParams.slug === "ai-masterclass" ? "AI Integration" : "Modern Development"} />

        {/* Concrete Syllabus Grid */}
        <LearningOutcomes />

        {/* Live features list */}
        <Benefits />

        {/* simulated dashboard mockup */}
        <WebinarExperience />

        {/* Detailed bios */}
        <Speaker speaker={defaultSpeaker} />

        {/* Vertical agenda schedule */}
        <Agenda agenda={agenda} />

        {/* Value stack resources */}
        <Bonuses bonuses={bonuses} />

        {/* Quotes list */}
        <Testimonials testimonials={testimonials} />

        {/* Signup form with countdown */}
        <Registration webinar={webinar} />

        {/* Accessible accordions */}
        <FAQ faqs={faqs} webinarTitle={webinar.title} />

        {/* Last conversion button */}
        <FinalCTA webinarTitle={webinar.title} />
      </main>

      <Footer />
      
      {/* Sticky mobile CTA element */}
      <MobileStickyCTA webinarTitle={webinar.title} />
    </>
  );
}
