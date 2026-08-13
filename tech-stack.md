# Webinar Landing Page — Technical Stack & Architecture

## 1. Technical Objective
Build a fast, scalable, reusable webinar landing-page system rather than a single static page.

The system should support:
- Multiple webinars
- Dynamic webinar pages
- Registration
- Lead storage
- Analytics
- UTM tracking
- Countdown
- Webinar status
- Email confirmation
- Calendar integration
- WhatsApp integration
- Future CRM integrations

## 2. Recommended Stack

### Frontend
- Next.js 16
- React 19
- TypeScript

### Styling
- Tailwind CSS

### UI
- shadcn/ui

### Animation
- Framer Motion

### Icons
- Lucide React

### Forms
- React Hook Form
- Zod

### Backend
- Supabase

### Database
- PostgreSQL via Supabase

### Email
- Resend

### Analytics
- Google Analytics 4
- Meta Pixel
- Optional Google Tag Manager

### Hosting
- Vercel

### Repository
- GitHub

### Optional Infrastructure
- Cloudflare for DNS/CDN/security

## 3. Architecture
Traffic from Meta Ads, Google Ads, social, and email enters the Next.js webinar page.

The frontend communicates with:
- Supabase for webinar/registration data
- Analytics providers for conversion tracking
- Resend for email
- Calendar integration
- WhatsApp integration

## 4. Application Structure
Use Next.js App Router.

Recommended structure:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── webinar/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── not-found.tsx
│   ├── thank-you/
│   │   └── page.tsx
│   └── api/
│       ├── register/
│       │   └── route.ts
│       ├── webinar/
│       │   └── route.ts
│       └── resend-confirmation/
│           └── route.ts
├── components/
│   ├── navbar/
│   ├── hero/
│   ├── countdown/
│   ├── webinar-details/
│   ├── trust/
│   ├── problems/
│   ├── learning/
│   ├── benefits/
│   ├── experience/
│   ├── speaker/
│   ├── agenda/
│   ├── bonuses/
│   ├── testimonials/
│   ├── registration/
│   ├── faq/
│   ├── final-cta/
│   ├── footer/
│   └── ui/
├── lib/
│   ├── supabase.ts
│   ├── analytics.ts
│   ├── validation.ts
│   ├── calendar.ts
│   ├── email.ts
│   └── utils.ts
├── types/
│   └── webinar.ts
├── config/
│   └── site.ts
└── styles/
    └── globals.css
```

## 5. Dynamic Webinar Architecture
Primary route:
`/webinar/[slug]`

Examples:
- `/webinar/digital-growth`
- `/webinar/ai-masterclass`
- `/webinar/cybersecurity`

The slug determines which webinar configuration is loaded.

## 6. Database Schema

### webinars
- id
- slug
- title
- subtitle
- description
- date
- start_time
- end_time
- timezone
- duration
- meeting_url
- status
- is_registration_open
- created_at
- updated_at

### speakers
- id
- webinar_id
- name
- designation
- company
- bio
- image_url
- experience
- achievements
- created_at

### registrations
- id
- webinar_id
- name
- email
- phone
- profession
- experience
- main_challenge
- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content
- registered_at
- attendance_status
- created_at

### testimonials
- id
- webinar_id
- name
- designation
- image_url
- content
- rating
- sort_order

### agenda
- id
- webinar_id
- title
- description
- duration
- sort_order

### faq
- id
- webinar_id
- question
- answer
- sort_order

### bonuses
- id
- webinar_id
- title
- description
- value
- image_url
- sort_order

## 7. TypeScript
Use strongly typed models.
Avoid `any` unless absolutely necessary.

## 8. Registration Flow
User clicks CTA
→ Registration form
→ Client validation
→ Server validation
→ Spam protection
→ Webinar check
→ Duplicate check
→ Database insert
→ Confirmation email
→ Analytics conversion
→ Success page

## 9. Registration API
Endpoint:
`POST /api/register`

Input:
- webinarId
- name
- email
- phone
- profession
- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content

Server responsibilities:
1. Validate
2. Sanitize
3. Verify webinar
4. Verify registration status
5. Detect duplicate
6. Save
7. Trigger confirmation
8. Return structured response

## 10. Validation
Use Zod.
Frontend validation is not sufficient; validate again server-side.

## 11. Spam Protection
Recommended:
- Cloudflare Turnstile
- Rate limiting
- Honeypot
- Server-side validation
- Duplicate detection

## 12. Email
Use Resend.

Templates:
- registration-confirmation
- 24-hour-reminder
- 1-hour-reminder
- webinar-live
- replay

## 13. Calendar
Generate:
- Google Calendar URL
- ICS file

Include:
- Title
- Date
- Start/end
- Timezone
- Meeting URL
- Description

## 14. WhatsApp
Initial implementation may use a configured WhatsApp link.

Future:
- WhatsApp Cloud API
- Automated reminders
- Confirmation
- Live notification
- Replay

Use appropriate consent.

## 15. Countdown
Calculate against:
- webinar.start_time
- webinar.timezone

Never hardcode countdown duration.

States:
- UPCOMING
- LIVE
- COMPLETED

## 16. Analytics
Centralize analytics calls.

Events:
- page_view
- hero_cta_click
- cta_click
- form_start
- form_submit
- registration_success
- calendar_click
- whatsapp_click
- faq_open

## 17. UTM Tracking
Capture:
- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content

Persist through registration using URL parameters and appropriate session storage/cookies.

## 18. Meta Pixel
Track:
- PageView
- ViewContent
- Lead
- CompleteRegistration

Use a centralized analytics layer.

## 19. Google Analytics
Use a centralized tracking utility.

Example event:
`registration_success`

Attach:
- webinar_id
- webinar_slug

## 20. SEO
Every webinar should have unique:
- title
- description
- canonical URL
- OG title
- OG description
- OG image

## 21. Structured Data
Where applicable:
- Event
- Person
- Organization

Only use accurate fields.

## 22. Image Optimization
Use Next.js Image.
Preferred formats:
- AVIF
- WebP

Requirements:
- Responsive sizes
- Lazy loading below fold
- Explicit dimensions
- Alt text
- Hero image priority when appropriate

## 23. Performance
Targets:
- Lighthouse Performance 90+
- LCP under 2.5s where practical
- CLS under 0.1
- Good INP

Rules:
- Minimize JavaScript
- Prefer Server Components
- Use Client Components only for interaction
- Lazy load heavy media
- Optimize fonts
- Avoid unnecessary third-party scripts

## 24. Server vs Client Components
Prefer Server Components for:
- Webinar content
- Speaker
- Agenda
- FAQ
- Testimonials
- Static sections

Client Components for:
- Countdown
- Registration form
- FAQ interaction
- Analytics interactions
- Required animations

## 25. Styling Architecture
Use Tailwind CSS.
Create design tokens for:
- colors
- spacing
- radius
- typography
- shadows

Avoid random hardcoded values.

## 26. Component Philosophy
Components should be:
- Reusable
- Small
- Typed
- Accessible
- Maintainable

Do not create one giant page component.

## 27. UI Components
Use shadcn/ui selectively for:
- Accordion
- Dialog
- Input
- Button
- Form
- Toast

Customize the visual layer to match the design document.

## 28. Animation
Use Framer Motion for:
- Hero reveal
- Section reveal
- Floating UI
- Card hover
- FAQ transitions
- CTA micro-interactions

Respect `prefers-reduced-motion`.

## 29. Accessibility
All interactive elements must support:
- Keyboard navigation
- Focus states
- Screen readers
- Reduced motion
- Proper labels

Use semantic HTML.

## 30. Security
- HTTPS
- Server validation
- Input sanitization
- Rate limiting
- Secure environment variables
- No secrets in client code
- Protected admin APIs
- Spam protection

Never expose the Supabase service-role key to the browser.

## 31. Environment Variables
Example:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
```

Sensitive keys remain server-side.

## 32. Deployment
Recommended: Vercel

Pipeline:
GitHub → Pull Request → Vercel Preview → QA → Production

## 33. Git Workflow
Branches:
- main
- develop
- feature/*
- fix/*

Commit prefixes:
- feat:
- fix:
- refactor:
- style:
- docs:
- chore:

## 34. Testing
Unit:
- Validation
- Date/time calculations
- Webinar status
- UTM parsing

Integration:
- Registration API
- Supabase
- Email
- Duplicate registration

E2E:
- Landing page → CTA → Form → Registration → Success

Recommended tool:
**Playwright**

## 35. Browser Testing
Desktop:
- Chrome
- Edge
- Safari

Mobile:
- Android Chrome
- iOS Safari

## 36. Error Handling
Registration failure:
`Something went wrong. Please try again.`

Duplicate:
`You're already registered. We've sent your confirmation again.`

Closed:
`Registration for this webinar is closed.`

Never expose internal stack traces.

## 37. Caching
Cache webinar content where appropriate.
Registration endpoints must remain dynamic.
Never cache personal registration responses.

## 38. Scalability
The architecture should support:
- 1 webinar
- 10 webinars
- 100+ webinars

without duplicating frontend code.

Key pattern:
**Dynamic slug + Database-driven content + Reusable components**

## 39. Future Admin Dashboard
Potential route:
`/dashboard`

Features:
- Create/edit webinar
- Manage speakers
- Manage testimonials
- Manage FAQs
- View registrations
- Export CSV
- Attendance tracking
- Analytics
- Campaign attribution

## 40. Future CRM Integration
Potential integrations:
- HubSpot
- Zoho
- Salesforce
- GoHighLevel
- Custom CRM

Keep registration logic abstract enough to add integrations later.

## 41. Recommended Dependencies

Core:
- next
- react
- react-dom
- typescript

UI:
- tailwindcss
- shadcn/ui
- lucide-react

Animation:
- framer-motion

Forms:
- react-hook-form
- zod
- @hookform/resolvers

Backend:
- @supabase/ssr
- @supabase/supabase-js

Email:
- resend

Testing:
- playwright

## 42. Avoid Unnecessary Technologies
Do not add without a concrete requirement:
- Redux
- MongoDB
- Express
- Three.js
- GSAP
- Firebase
- Docker
- Kubernetes
- Large component libraries
- Multiple animation libraries

## 43. MVP
Stack:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Supabase
- React Hook Form
- Zod
- Resend
- GA4
- Meta Pixel
- Vercel
- GitHub

MVP features:
- Dynamic webinar page
- Hero
- Countdown
- Benefits
- Speaker
- Agenda
- Testimonials
- FAQ
- Registration
- Database
- Confirmation
- Calendar
- Analytics
- Responsive design

## 44. Version 2
- Admin dashboard
- Multiple webinars
- Automated reminders
- WhatsApp API
- Attendance tracking
- Replay
- Lead scoring
- CRM integration
- A/B testing

## 45. Version 3
Potential evolution into:
- Webinar Management
- Landing Page Builder
- Registration CRM
- Email Automation
- WhatsApp Automation
- Analytics
- Attendee Management

## 46. Final Technical Recommendation
**Frontend:** Next.js 16 + React 19 + TypeScript  
**Styling:** Tailwind CSS + shadcn/ui  
**Animation:** Framer Motion  
**Icons:** Lucide  
**Forms:** React Hook Form + Zod  
**Backend:** Supabase/PostgreSQL  
**Email:** Resend  
**Analytics:** GA4 + Meta Pixel  
**Testing:** Playwright  
**Hosting:** Vercel  
**Repository:** GitHub  
**Optional:** Cloudflare

## 47. Engineering Principle
Build a reusable webinar system, not a single hardcoded landing page.

The frontend should be visually premium and custom, while the underlying architecture remains simple, typed, modular, performant, secure, and scalable.
