import { getSkills } from "@/app/admin/actions/skillStatActions";
import Skills from "@/components/public/Skills";

export const revalidate = 60;

export default async function SkillsPage() {
  const skills = await getSkills().catch(() => []);

  return (
    <div className="flex flex-col min-h-full">
      {skills.length > 0 ? <Skills skills={skills} /> : (
        <div className="min-h-[60vh] flex items-center justify-center font-mono text-text-tertiary">
          No skills added yet.
        </div>
      )}
    </div>
  );
}
