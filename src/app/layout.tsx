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
    template: "%s | Faizcasm",
    default: "Faizan Hameed",
  },
  description:
    "Portfolio of Faizan Hameed (faizcasm) — Software Engineer building backend systems, distributed services, full-stack products and production AI agents.",
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
