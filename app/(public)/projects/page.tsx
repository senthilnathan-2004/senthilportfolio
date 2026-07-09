import { getProjects } from "@/app/admin/actions/projectActions";
import Projects from "@/components/public/Projects";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <div className="flex flex-col min-h-full">
      <Projects projects={projects} />
    </div>
  );
}
