import { getAbout } from "@/app/admin/actions/aboutActions";
import { getStats } from "@/app/admin/actions/skillStatActions";
import { getHero } from "@/app/admin/actions/heroActions";
import About from "@/components/public/About";
import Stats from "@/components/public/Stats";

export const revalidate = 60;

export default async function AboutPage() {
  const [about, stats, hero] = await Promise.all([
    getAbout().catch(() => null),
    getStats().catch(() => []),
    getHero().catch(() => null),
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
          heroImageUrl={hero?.portraitImageUrl || ""}
          captionName={hero?.captionName || "Senthilnathan R"}
        />
      )}
      {stats.length > 0 && <Stats stats={stats} />}
    </div>
  );
}
