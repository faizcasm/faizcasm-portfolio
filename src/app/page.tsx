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

export const metadata = {
  title: "Faizan Hameed Tantray | Forward Deployed Engineer & Agentic AI Engineer",
  description:
    "Portfolio of Faizan Hameed Tantray (@faizcasm) — Forward Deployed Engineer, Software Engineer and Agentic AI Engineer building scalable web platforms, backend systems and production AI agents.",
};

const HomePage: React.FC = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Faizan Hameed Tantray",
    jobTitle:
      "Forward Deployed Engineer, Software Engineer, Agentic AI Engineer, Founder of Wolvinix",
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
    description: `Faizan Hameed Tantray
Forward Deployed Engineer • Software Engineer • Agentic AI Engineer
📍 Palhallan Pattan, Srinagar, India

I design and ship scalable web platforms, backend systems and production-grade AI agents — blending deep full-stack expertise with practical agentic AI engineering to build user-focused solutions that scale.`,
    email: "faizanhameed690@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Srinagar",
      addressRegion: "Pattan",
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
              <GitHubStats />
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
            className="sm:col-span-2 md:col-span-3 lg:grid-cols-2 gap-4"
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
            className="sm:col-span-2 md:col-span-3 lg:grid-cols-2 gap-4"
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
