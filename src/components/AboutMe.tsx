import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/me.jpg";
import { Twitter, GithubIcon, Linkedin } from 'lucide-react';

const AboutMe: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:col-span-3 lg:col-span-4">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <Image
            src={heroImage}
            alt="Faizan profile picture"
            className="rounded-full shadow-md h-32 w-32 object-cover object-center ring-4 ring-blue-500 dark:ring-blue-400"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Faizan Hameed</h1>
            <p className="text-blue-600 dark:text-blue-400 mb-4">@faizcasm&apos;s</p> {/* Escaped apostrophe */}
             <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
  Faizan Hameed Tantray, Fullstack Developer and Founder of Wolvinix from Palhallan Pattan, Srinagar, India. Specializing in building sleek, efficient web apps while exploring AI to create intelligent solutions that align user needs with business goals.
</p>

            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Founder of Wolvinix social network
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="https://twitter.com/faizanhameedtan" target='_blank' className="text-blue-400 hover:text-blue-500 transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://github.com/faizcasm" target='_blank' className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                <GithubIcon className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/faizan-hameed-a54316255" target='_blank' className="text-blue-700 hover:text-blue-800 transition-colors duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
