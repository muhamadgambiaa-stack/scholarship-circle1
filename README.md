# The Scholarship Circle

A lightweight, fast, SEO-friendly scholarship blog built with **Next.js 14 (App Router)**,
**TypeScript**, **Tailwind CSS**, and **Sanity CMS**.

## Stack

- **Next.js 14** — App Router, ISR (`revalidate = 3600`), static generation for scholarship/country/category/blog pages
- **TypeScript** — strict mode
- **Tailwind CSS** — blue/navy + gold color scheme, no heavy UI framework
- **Sanity CMS** — embedded Studio at `/studio`, so you publish without touching code
- **next-sanity / GROQ** — typed content fetching
- SEO: dynamic metadata, `sitemap.ts`, `robots.ts`, JSON-LD structured data, Open Graph tags, canonical URLs, breadcrumbs

## 1. Install

```bash
npm install
```

## 2. Set up Sanity

1. Go to https://www.sanity.io/manage and create a new project (free tier is enough to start).
2. Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-01
SANITY_API_READ_TOKEN=       # only needed if you add draft previews later
SANITY_REVALIDATE_SECRET=    # shared secret for Sanity webhook revalidation
NEXT_PUBLIC_SITE_URL=https://thescholarshipcircle.com
```

3. Run the app:

```bash
npm run dev
```

4. Open **http://localhost:3000/studio** — this is your admin dashboard. It's the real Sanity
   Studio, embedded directly in the Next.js app, so there's nothing separate to deploy.

## 3. Content model

Four document types are defined in `sanity/schemaTypes/`:

- **scholarship** — the main post type: title, featured image, country, university, provider,
  degree level, funding type, eligible countries, deadline, benefits, eligibility, required
  documents, application process, official application link, related scholarships, SEO fields
- **country** — powers `/countries/[slug]` archive pages and the "Popular Destinations" section
- **category** — powers `/categories/[slug]` archive pages (Bachelor's, Master's, PhD, Fellowships, etc.)
- **post** — general blog content for `/blog`

Publishing a new scholarship in the Studio makes it live automatically — pages revalidate
hourly (ISR), and you can trigger an instant on-demand rebuild any time by re-deploying or
wiring a Sanity webhook to your host's deploy hook.

## 4. Seed starter content

Nothing is hardcoded — you'll want to create at least:

- A few **Category** entries (Bachelor's, Master's, PhD, Fellowships, Internships, Exchange
  Programs, Competitions)
- **Country** entries for the destinations in the brief (UK, Canada, US, Germany, Australia,
  Turkey, Italy, China, Japan, Indonesia, Europe, Africa) — mark the ones you want in "Popular
  Destinations" with `popular: true`
- A handful of **Scholarship** posts to see the homepage populate

## 5. Deploy

- **Vercel** (recommended): import the repo, add the same env vars from `.env.local` in the
  Vercel dashboard, deploy.
- **Netlify**: same idea — set the env vars, use the Next.js runtime plugin.
- Optional but recommended: add a Sanity webhook (Settings → API → Webhooks) that calls
  https://your-domain.com/api/revalidate on document publish/update, using the same
  secret you set in SANITY_REVALIDATE_SECRET. This makes new content appear immediately
  instead of waiting for the hourly revalidation window.

## Project structure

```
sanity/
  schemaTypes/     # content model (scholarship, country, category, post)
  lib/              # Sanity client, image builder, GROQ queries
sanity.config.ts    # Studio config (mounted at /studio)
src/
  app/              # routes (App Router)
  components/       # layout, home sections, scholarship, ui, seo
  lib/              # seo.ts, utils.ts
  types/            # shared TypeScript types
```

## Notes

- The founder photo is a placeholder SVG at `public/founder-placeholder.svg` — swap in the
  real photo of Muhammed J Bah (upload to `/public` or move it into Sanity if you'd rather
  manage it from the Studio).
- The newsletter form in `src/components/home/Newsletter.tsx` is UI-only — wire the `onSubmit`
  handler to an email provider (Resend, Mailchimp, ConvertKit, Buttondown, etc.) when ready.
- Search is a simple GROQ `match` query across title/university/provider/country — fine at
  this scale; if the catalog grows into the thousands and you want typo-tolerant search,
  consider adding Algolia or Sanity's own search API later without changing the page structure.
