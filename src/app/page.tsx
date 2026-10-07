import React from "react";

import AboutMe from "@/components/AboutMe";
import Technologies from "@/components/Technologies";
import FeaturedProjects from "@/components/FeaturedProjects";
import LatestPosts from "@/components/LatestPosts";
import GitHubStats from "@/components/GitHubStats";
import Timeline from "@/components/Timeline";
import Languages from "@/components/Languages";
import Hobbies from "@/components/Hobbies";
import ContactPage from "@/components/Contact";
import Reveal from "@/components/Reveal";
import { getGithubSnapshot } from "@/lib/github";

export const metadata = {
  title: "Faizan Hameed | Software Engineer — Backend, Full-Stack & Agentic AI",
  description:
    "Portfolio of Faizan Hameed (@faizcasm) — Software Engineer building backend systems, distributed services, full-stack products and production AI agents with TypeScript, Node.js, PostgreSQL, Redis, Docker and AWS.",
};

export const revalidate = 3600;

const HomePage: React.FC = async () => {
  const { profile, languages, live } = await getGithubSnapshot();
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Faizan Hameed",
    jobTitle:
      "Software Engineer — Backend & Distributed Systems, Full-Stack, Agentic AI / LLM Engineering, Founder of Ryuksaidso",
    url: "https://faizcasm.me",
    image:
      "https://res.cloudinary.com/dvqs8ferk/image/upload/v1729588663/muegehb9q00obxstv57m.jpg",
    sameAs: [
      "https://www.linkedin.com/in/faizan-hameed-tantray-a54316255",
      "https://x.com/faizanhameedtan",
      "https://github.com/faizcasm",
      "https://www.instagram.com/faizcasmcodes",
      "https://youtube.com/@faizcasm",
    ],
    description: `Faizan Hameed
Software Engineer — Backend & Distributed Systems • Full-Stack • Agentic AI / LLM Engineering
📍 Jammu & Kashmir, India

5 years of experience building backend systems, full-stack products, distributed services, real-time platforms and production AI systems — founder and lead engineer of Ryuksaidso, a production-oriented agent reliability and control-plane platform.`,
    email: "faizanhameed690@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pattan, Srinagar",
      addressRegion: "Jammu & Kashmir",
      postalCode: "193121",
      addressCountry: "India",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/60 p-4 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Reveal className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
            <AboutMe />
          </Reveal>
          <Reveal
            delay={0.05}
            className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <GitHubStats profile={profile} languages={languages} live={live} />
            </div>
            <div className="flex flex-col">
              <Technologies />
            </div>
          </Reveal>
          <Reveal
            delay={0.05}
            className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6"
          >
            <FeaturedProjects />
          </Reveal>
          <Reveal
            delay={0.05}
            className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6"
          >
            <Timeline />
          </Reveal>
          <Reveal
            delay={0.05}
            className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <LatestPosts />
            </div>
            <div className="flex flex-col">
              <Languages />
            </div>
          </Reveal>
          <Reveal
            delay={0.05}
            className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <Hobbies />
            </div>
            <div className="flex flex-col">
              <ContactPage />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
};

export default HomePage;
