# Premium Webinar Landing Page System

A production-ready, premium, and conversion-focused webinar landing page system built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **TypeScript**. This application is architected from day one for seamless deployment to **Cloudflare Workers** using the official `@opennextjs/cloudflare` adapter and **OpenNext**.

---

## 🚀 Tech Stack

*   **Framework:** Next.js 16 (App Router) & React 19
*   **Styling:** Tailwind CSS v4 & custom design tokens
*   **Animations:** Framer Motion (with `prefers-reduced-motion` compliance)
*   **Database:** Supabase (PostgreSQL)
*   **Forms & Validation:** React Hook Form + Zod
*   **Email Deliverability:** Resend API
*   **Analytics Layer:** Centralized triggers for Google Analytics 4 & Meta Pixel
*   **Target Deployment:** Cloudflare Workers + OpenNext

---

## 🛠️ Local Setup & Installation

1.  **Clone or navigate to the repository:**
    ```bash
    cd "webinar website anti code"
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Copy `.env.example` to `.env.local` and fill in the active API keys:
    ```bash
    cp .env.example .env.local
    ```

4.  **Run development server locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the default webinar route: `/webinar/digital-growth`.

---

## 🗄️ Supabase Setup

Configure your PostgreSQL database tables in Supabase by running the SQL scripts provided in [supabase/schema.sql](file:///d:/webinar%20website%20anti%20code/supabase/schema.sql) using the Supabase SQL Editor.

The SQL file provisions the following tables with necessary constraints, cascades, indexes, and primary UUID triggers:
*   `webinars` (stores dynamic webinar configurations)
*   `speakers` (details about the masterclass hosts)
*   `registrations` (captures leads with phone numbers and UTM sources)
*   `agenda` (chronological session schedule timeline)
*   `testimonials` (ratings and reviewer quotes)
*   `faq` (keyboard-accessible accordions info)
*   `bonuses` (exclusive resource downloads)

---

## ☁️ Deploy to Cloudflare

This application uses the official `@opennextjs/cloudflare` adapter to compile and bundle the Next.js App Router for the Cloudflare Workers execution environment.

### Deployment Instructions

1.  **Install Cloudflare devDependencies:**
    Ensure you have `wrangler` and the OpenNext adapter installed:
    ```bash
    npm install -D wrangler @cloudflare/workers-types
    npm install @opennextjs/cloudflare
    ```

2.  **Authenticate Wrangler CLI with your Cloudflare account:**
    ```bash
    npx wrangler login
    ```

3.  **Build the application for Cloudflare:**
    Compile your Next.js project using OpenNext:
    ```bash
    npm run build
    ```
    This generates the `.open-next` bundle directory containing the compiled Worker code (`.open-next/worker.js`) and optimized assets (`.open-next/assets`).

4.  **Configure Production Secrets in Cloudflare Workers:**
    Before deploying, upload your secure API keys and Supabase credentials to the Cloudflare environment using Wrangler secrets:
    ```bash
    npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
    npx wrangler secret put RESEND_API_KEY
    ```
    Set other environment values directly in `wrangler.jsonc` under `vars` (or configure them in your Cloudflare Workers Dashboard).

5.  **Deploy to Cloudflare Workers:**
    Publish your application to the Edge:
    ```bash
    npx wrangler deploy
    ```

6.  **Add a Custom Domain:**
    *   Navigate to your **Cloudflare Dashboard** > **Workers & Pages**.
    *   Select your deployed worker: `premium-webinar-landing-page`.
    *   Go to the **Settings** > **Triggers** tab.
    *   Under **Custom Domains**, click **Add Custom Domain** and enter `example.com` or `www.example.com`.

---

## ⚙️ Environment Variables Schema

Fill in these keys inside `.env.local` for local development, and configure them on your hosting platform for production deployments:

| Variable Name | Description | Client/Server Exposure |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of the website | Public (Client & Server) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API connection string | Public (Client & Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous key | Public (Client & Server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged insert role credentials | **Secret (Server Only)** |
| `RESEND_API_KEY` | Resend API key for confirmation emails | **Secret (Server Only)** |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | Public (Client & Server) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel tracking ID | Public (Client & Server) |

---

## 🔍 Verification & Troubleshooting

### Local Preview
Preview the production build locally under a simulated worker runtime:
```bash
npx wrangler dev
```

### Common Gotchas & Fixes

*   **TypeScript Error on `ZodError` properties:**
    Make sure you access `.issues` instead of `.errors` on Zod results (e.g. `result.error.issues[0].message`).
*   **Metadata alternatives warning:**
    Next.js uses `alternates` configuration instead of `alternatives` inside Metadata objects (e.g. `alternates: { canonical: ... }`).
*   **Hydration Mismatch on Countdown:**
    The countdown uses a React mounting hook to prevent rendering mismatched times during server rendering versus client system time zones.
*   **Supabase SSR secrets restriction:**
    Ensure `SUPABASE_SERVICE_ROLE_KEY` is never referenced in client component modules to prevent build failures.
