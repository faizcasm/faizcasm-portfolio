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
import { resumeData } from "@/data/resumeData";

export const metadata = {
  title: "Faizan Hameed | Software Engineer / Agentic AI Engineer",
  description:
    "Portfolio of Faizan Hameed — Software Engineer / Agentic AI Engineer building backend systems, full-stack products, distributed services, and production AI systems.",
};

export const revalidate = 3600;

const HomePage: React.FC = async () => {
  const { profile, languages, live } = await getGithubSnapshot();
  const { personalInfo } = resumeData;
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    url: personalInfo.website,
    image:
      "https://res.cloudinary.com/dvqs8ferk/image/upload/v1729588663/muegehb9q00obxstv57m.jpg",
    sameAs: [personalInfo.github, personalInfo.website],
    description: personalInfo.summary,
    email: personalInfo.email,
    telephone: personalInfo.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Srinagar",
      addressRegion: "Jammu & Kashmir",
      addressCountry: "India",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/60 p-4 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 md:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
