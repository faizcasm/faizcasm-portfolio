# Faizcasm Portfolio (Next.js + AI Features)

This repository contains Faizan Hameed's personal portfolio, built with Next.js, TypeScript, and Tailwind CSS. It showcases recent full-stack and AI engineering work, including practical agentic-system capabilities and project highlights.

## Features

- Responsive portfolio website with modern UI sections
- AI chatbot integrated into the website
- Dynamic content management for projects and blog posts
- Live GitHub integration powering the top-languages chart
- Dark mode support

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
- Scroll-reveal animations on every homepage section (framer-motion, `whileInView`)
- Back-to-top button (bottom-left, so it never covers the chat widget)
- Cursor-tracking glow + gradient halo on the hero card
- Interactive 3D top-languages donut built from stacked SVG layers — hover a slice to lift it out of the disc, with a synced legend (falls back to a labelled snapshot if the GitHub API is rate-limited)
- Tech stack grouped by the resume's skill categories: Languages, Frontend, Backend, Data, Agentic AI, Cloud & DevOps, Engineering

### Resume

- Full HTML resume generated from `src/data/resumeDtata.json`, mirroring the official PDF (summary, skills, experience, projects, education) with the profile photo
- Embedded PDF viewer for the real `public/Faizcasm.pdf`, plus download and open-in-new-tab buttons

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Octokit (for GitHub API integration)
- Langchain (for AI chatbot functionality)
- Vercel (for deployment)

## Project Structure


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

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   GITHUB_SECRET=your_github_personal_access_token
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Generate embeddings for the chatbot:
   ```bash
   npm run generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Profile Notes

- Current focus: AI engineering + full-stack systems
- Education: BCA completed, currently pursuing MCA at NIELIT Srinagar
- Portfolio content is refreshed to reflect growth across the last two years of project work and learning

## Updating Content

To update the chatbot's knowledge:

1. Modify the `data.json` file with your updated content
2. Run the embedding generation script:
   ```bash
   npm run generate
   ```
3. Deploy the updates to Vercel

## Customization

- Modify the components in `src/components/` to change the layout and design of your portfolio
- Update the `src/app/` directory to add or modify pages
- Adjust the chatbot's behavior by modifying the `Chatbot.tsx` component and the embedding generation script

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.