import { getAbout } from "@/app/admin/actions/aboutActions";
import { getStats } from "@/app/admin/actions/skillStatActions";
import About from "@/components/public/About";
import Stats from "@/components/public/Stats";

export const revalidate = 60;

export default async function AboutPage() {
  const [about, stats] = await Promise.all([
    getAbout().catch(() => null),
    getStats().catch(() => []),
  ]);

  return (
    <div className="flex flex-col min-h-full">
      {about && (
        <About
          tagLabel={about.tagLabel || "<About>"}
          bioRichText={about.bioRichText || ""}
          cvUrl={about.cvUrl || ""}
          imageUrl={about.imageUrl || ""}
          imageAlt={about.imageAlt || "About photo"}
        />
      )}
      {stats.length > 0 && <Stats stats={stats} />}
    </div>
  );
}
