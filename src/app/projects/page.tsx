import ProjectsGrid from "@/components/ProjectsGrid";
import { getProjectsSnapshot } from "@/lib/github";

export const revalidate = 3600;

export const metadata = {
  title: "Projects",
  description:
    "Selected projects by Faizan Hameed across backend, full-stack, and agentic AI engineering.",
};

export default async function Projects() {
  const { projects, live } = await getProjectsSnapshot();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          Projects
        </h1>
        <ProjectsGrid projects={projects} live={live} />
      </main>
    </div>
  );
}
