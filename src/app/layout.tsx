import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSortedPostsData } from "../../utils/markdown";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://faizcasm.me"),
  title: {
    template: "%s | Faizcasm",
    default: "Faizan Hameed",
  },
  description: "Check out my portfolio website with a custom AI chatbot.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getSortedPostsData();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
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
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
