import { getHero } from "@/app/admin/actions/heroActions";
import { getSiteSettings } from "@/app/admin/actions/settingsActions";
import Hero from "@/components/public/Hero";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [hero, settings] = await Promise.all([
    getHero().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <>
      {hero && (
        <Hero
          badgeText={hero.badgeText || "<6+ Year Experience>"}
          headline={hero.headline || "BUILDING FAST,\nSCALABLE, AND\nSECURE WEBSITE"}
          portraitImageUrl={hero.portraitImageUrl || ""}
          portraitAlt={hero.portraitAlt || "Developer portrait"}
          captionName={hero.captionName || "Alex Rivera"}
          socialLinks={hero.socialLinks || []}
        />
      )}
    </>
  );
}
