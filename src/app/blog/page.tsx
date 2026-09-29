import {
  getSortedPostsData,
  getAllCategories,
  getAllTags,
} from "../../../utils/markdown";
import BlogList from "@/components/BlogList";

export const metadata = {
  title: "Blog | Faizan Hameed",
  description:
    "Explore insightful articles on web development, AI engineering, design, and technology.",
};

interface BlogPageProps {
  searchParams?: {
    q?: string;
    tag?: string;
    category?: string;
    year?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getSortedPostsData();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  const years = Array.from(
    new Set(posts.map((post) => post.date.slice(0, 4)))
  ).sort((a, b) => b.localeCompare(a));

  // Only honour deep-linked filters that actually exist, so the
  // controls always reflect the current state.
  const initialFilters = {
    q: searchParams?.q,
    tag: tags.includes(searchParams?.tag ?? "") ? searchParams?.tag : undefined,
    category: categories.includes(searchParams?.category ?? "")
      ? searchParams?.category
      : undefined,
    year: years.includes(searchParams?.year ?? "") ? searchParams?.year : undefined,
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-white">
          Insights &amp; Thoughts
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Writing on full-stack development, AI engineering and the projects
          along the way.
        </p>
      </header>

      <BlogList
        posts={posts}
        categories={categories}
        tags={tags}
        years={years}
        initialFilters={initialFilters}
      />
    </section>
  );
}
