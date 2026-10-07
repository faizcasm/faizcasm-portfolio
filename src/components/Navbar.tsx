"use client"


import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import CommandPalette, { type PalettePost } from "./CommandPalette";
import { Home, Briefcase, BookOpen, Github, FileText } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "GitHub Insights", href: "/github-stats", icon: Github },
  { name: "Resume", href: "/resume", icon: FileText },
];

interface NavbarProps {
  posts?: PalettePost[];
}

export default function Navbar({ posts = [] }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/70">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              Faizan Hameed
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:text-white"
                >
                  <link.icon className="w-5 h-5 mr-2" />
                  {link.name}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CommandPalette posts={posts} />
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex -mr-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <motion.div
          className="bg-white/95 backdrop-blur-md dark:bg-gray-900/95 md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200"
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-5">
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}