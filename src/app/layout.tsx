import BackToTop from "@/components/BackToTop";
import Navbar from "@/components/Navbar";
import PrintThemeSync from "@/components/PrintThemeSync";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSortedPostsData } from "../../utils/markdown";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://faizcasm.me"),
  title: {
    template: "%s | Faizan Hameed",
    default: "Faizan Hameed | Software Engineer / Agentic AI Engineer",
  },
  description:
    "Portfolio of Faizan Hameed — Software Engineer / Agentic AI Engineer.",
  openGraph: {
    title: "Faizan Hameed | Software Engineer / Agentic AI Engineer",
    description:
      "Backend, distributed systems, full-stack, and production agentic AI engineering portfolio.",
    url: "https://faizcasm.me",
    siteName: "Faizan Hameed Portfolio",
    images: [{ url: "/images/faizcasm.jpg", width: 1200, height: 630, alt: "Faizan Hameed" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faizan Hameed | Software Engineer / Agentic AI Engineer",
    description:
      "Backend, distributed systems, full-stack, and production agentic AI engineering portfolio.",
    images: ["/images/faizcasm.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getSortedPostsData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar
            posts={posts.map((post) => ({
              id: post.id,
              title: post.title,
              category: post.category,
            }))}
          />
          <main className="p-4 pb-12 max-w-7xl mx-auto overflow-hidden lg:overflow-visible">
            {children}
          </main>
          <BackToTop />
          <PrintThemeSync />
        </ThemeProvider>
      </body>
    </html>
  );
}
