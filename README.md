# Faizcasm Portfolio (Next.js)

Faizan Hameed's personal portfolio, built with Next.js (App Router), TypeScript and Tailwind CSS. It showcases full-stack and agentic-AI engineering work, a dynamic blog and an interactive GitHub section — production-ready on Vercel.

## Features

- Responsive portfolio site with modern UI sections (hero, timeline, skills, projects, contact)
- **Dynamic blog** — posts are managed at runtime through an admin panel backed by SQLite/libSQL, with the existing `posts/*.md` files migrated automatically
- **Admin panel** at `/admin` — login, create/edit/delete posts, publish/unpublish, markdown editor with live preview
- Live GitHub integration (server-side, cached) powering the top-languages chart and projects grid
- Dark mode with system preference detection; print-safe themes
- ⌘K command palette, scroll-reveal animations, reading progress, TOC, tag filtering, share buttons
- 3D visuals: a WebGL hero scene (three.js / react-three-fiber) behind the intro card, a CSS-3D top-languages donut and perspective-tilt project cards

### Blog reading experience

- Reading progress bar pinned above the navbar while you read
- Sticky table of contents with active-section highlighting (plus a collapsible version on mobile)
- Anchor ids on every heading, so sections can be deep-linked (`/blog/post#heading`)
- Search, category, tag and year filtering on the blog index — deep-linkable, e.g. `/blog?tag=Next.js`
- Share row on each post: copy link, X, LinkedIn and email
- Code blocks with a one-click copy button
- Post tags link straight to the matching filtered blog index
- Rich link previews (Open Graph + Twitter card) for shared posts

### Modern UX

- ⌘K / Ctrl+K command palette — fuzzy search across pages, projects and blog posts, with keyboard navigation
- Scroll-reveal animations on every homepage section (framer-motion, `whileInView`, eased scale-in)
- Back-to-top button (bottom-left)
- Cursor-tracking glow + gradient halo on the hero card
- WebGL hero backdrop — slow-orbiting wireframe core, particle shell and emissive rings (loaded client-only, disabled for reduced-motion and missing-WebGL)
- 3D perspective tilt on featured-project cards (pointer-tracked rotateX/rotateY with a tracking highlight)
- Interactive 3D top-languages donut built from stacked SVG layers — hover a slice to lift it out of the disc, with a synced legend (falls back to a labelled snapshot if the GitHub API is rate-limited)
- Tech stack grouped by the resume's CORE TECHNICAL SKILLS categories: Languages, Backend, Frontend, Data, AI / Agents, LLM Engineering, Cloud / DevOps, Engineering

### Resume

- Full HTML resume generated from `src/data/resumeData.ts`, mirroring the official PDF (summary, skills, experience, projects, education) with the profile photo
- Embedded PDF viewer for the real `public/Faizan-Hameed-Resume.pdf`, plus download and open-in-new-tab buttons

## Tech Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS (+ `@tailwindcss/typography`)
- three.js + `@react-three/fiber` for the 3D hero scene; framer-motion for scroll/entrance motion
- SQLite via `@libsql/client` (local `file:` DB; Turso-compatible on Vercel)
- `react-markdown` + `gray-matter` for blog content (server-rendered, no raw HTML)
- Server-side GitHub API access (native `fetch`, ISR-cached) — no tokens in the browser
- Nodemailer for the contact form
- Vercel for deployment

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/faizcasm/faizcasm-portfolio.git
   cd faizcasm-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template and fill it in (see `.env.example` for details):
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Purpose |
   | --- | --- |
   | `ADMIN_USERNAME` / `ADMIN_PASSWORD` | `/admin` login credentials (required) |
   | `GITHUB_SECRET` (or `GITHUB_TOKEN`) | GitHub token, used **server-side only** to avoid the anonymous rate limit |
   | `MAIL_USER` / `MAIL_PASS` / `MAIL_TO` | Contact-form Gmail account + app password |
   | `DATABASE_URL` (+ `TURSO_AUTH_TOKEN`) | Optional — persistent DB on Vercel (Turso). Locally a SQLite file is used automatically. |

   `.env.local` is gitignored. **Never commit real credentials — this repository is public.**

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database & content

- Locally the SQLite file `data/portfolio.db` is created and seeded from `posts/*.md` on first use (gitignored). The seed runs once — posts deleted in the admin panel are not resurrected by rebuilds; `npm run db:seed -- --force` re-seeds.
- On **Vercel the filesystem is read-only**, so set `DATABASE_URL` to a libSQL/Turso database if you want admin writes to persist. Without it the site still builds and serves the blog from the markdown files (read-only on Vercel).
- Admin panel: `https://your-domain/admin` (login → dashboard → New/Edit/Delete/Publish). `/admin` is blocked in `robots.txt` and served with `noindex` + `no-store` headers.

## Security & performance notes

- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) set in `next.config.mjs`
- GitHub tokens and mail credentials are server-side only (`server-only` module imports guard them); nothing sensitive ships to the browser
- Sessions: random 256-bit token, SHA-256 at rest in the DB, HTTP-only SameSite=Lax cookie, 7-day TTL, login rate limiting
- Markdown is rendered as React elements — no `rehype-raw`, so posts cannot inject HTML/scripts
- GitHub calls are ISR-cached for 1 hour, with in-flight deduplication and a process-memory cache of last-good payloads: when GitHub rate-limits (403/429), stale cached payloads are served for up to 6 hours before static fallbacks are used.
- `/admin` is disallowed for crawlers; blog posts prerendered with `revalidate = 3600`

## Project Structure

```
src/
  app/                 # App Router pages (home, blog, projects, resume, admin, api)
  components/          # UI components (incl. admin/)
  lib/                 # server-only modules: db, auth, posts, github, rate-limit
utils/markdown.ts      # DB-first blog data layer with markdown fallback
posts/*.md             # Blog source content (migrated into SQLite on first run)
scripts/seed.mjs       # markdown → SQLite migration (also runs during build)
public/                # static assets (Faizan-Hameed-Resume.pdf, images, robots.txt)
```

## Updating Content

- **Blog:** use the admin panel at `/admin`, or edit/add markdown files in `posts/*.md` (picked up automatically; seeded into the DB on first run).
- **Projects / GitHub:** automatic from the GitHub profile.
- **Resume:** edit `src/data/resumeData.ts` (HTML) and `public/Faizan-Hameed-Resume.pdf`.

## Customization

- Modify components in `src/components/`
- Add pages under `src/app/`
- Theme/colors: `tailwind.config.ts`, `src/app/globals.css`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
