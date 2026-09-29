"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, Link2, Linkedin, Mail, Twitter } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

/**
 * Share row for blog posts: copy link, X, LinkedIn and email.
 * URLs are built at click time so they always match the deployed domain.
 */
export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin + window.location.pathname);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — silently ignore.
    }
  };

  const links = [
    {
      name: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
    },
    {
      name: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      name: "Share by email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
        <Link2 size={16} />
        Share
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
      {links.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
        >
          <Icon size={15} />
          <span className="hidden sm:inline">{name.replace("Share on ", "")}</span>
        </a>
      ))}
    </div>
  );
}
