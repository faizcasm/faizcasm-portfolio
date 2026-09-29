import ProjectsGrid from "@/components/ProjectsGrid";
import { getProjectsSnapshot } from "@/lib/github";

export const revalidate = 3600;

export const metadata = {
  title: "Projects",
  description:
    "GitHub projects by Faizan Hameed Tantray — full-stack, backend and agentic AI work.",
};

export default async function Projects() {
  const { projects, live } = await getProjectsSnapshot();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-24 text-center">
          🧑‍💻Projects
        </h1>
        <ProjectsGrid projects={projects} live={live} />
      </main>
    </div>
  );
}
