import React from "react";
import Head from "next/head";

import AboutMe from "@/components/AboutMe";
import Technologies from "@/components/Technologies";
import FeaturedProjects from "@/components/FeaturedProjects";
import LatestPosts from "@/components/LatestPosts";
import GitHubStats from "@/components/GitHubStats";
import Timeline from "@/components/Timeline";
import Languages from "@/components/Languages";
import Hobbies from "@/components/Hobbies";
import ContactPage from "@/components/Contact";

const HomePage: React.FC = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Faizan Hameed Tantray",
    jobTitle: "Software Engineer, Founder of Wolvinix",
    url: "https://faizcasm.in",
    image:
      "https://res.cloudinary.com/dvqs8ferk/image/upload/v1729588663/muegehb9q00obxstv57m.jpg",
    sameAs: [
      "https://www.linkedin.com/in/faizan-hameed-tantray-a54316255",
      "https://x.com/faizanhameedtan",
      "https://github.com/faizcasm",
      "https://www.instagram.com/faizcasmcodes",
      "https://youtube.com/@faizcasm",
    ],
    description:
      `Faizan Hameed Tantray
Software Engineer • Founder of Wolvinix
📍 Palhallan Pattan, Srinagar, India

Crafting sleek, scalable web applications with precision and purpose. As the founder of Wolvinix,
a social network built for gamers, I blend deep fullstack expertise with a passion for AI turning complex ideas into intelligent,
user-focused solutions that scale. I'm all about writing clean code, building smart systems, and delivering products that actually solve problems.`,
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
      <Head>
        <title>Faizan Hameed Tantray</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>
      <div className="min-h-screen p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
            <AboutMe />
          </div>
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <GitHubStats />
            </div>
            <div className="flex flex-col">
              <Technologies />
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
            <FeaturedProjects />
          </div>
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
            <Timeline />
          </div>
          <div className="sm:col-span-2 md:col-span-3 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <LatestPosts />
            </div>
            <div className="flex flex-col">
              <Languages />
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-3 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Hobbies />
            </div>
            <div className="flex flex-col">
              <ContactPage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
