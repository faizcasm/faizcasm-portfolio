# Faizcasm Portfolio (Next.js + AI Features)

This repository contains Faizan Hameed's personal portfolio, built with Next.js, TypeScript, and Tailwind CSS. It showcases recent full-stack and AI engineering work, including practical agentic-system capabilities and project highlights.

## Features

- Responsive portfolio website with modern UI sections
- AI chatbot integrated into the website
- Dynamic content management for projects and blog posts
- GitHub integration to display repositories and contributions
- Dark mode support

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
   GITHUB_TOKEN=your_github_personal_access_token
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
- Education: BCA completed, currently pursuing MCA at KIECAT Srinagar
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