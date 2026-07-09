import { getSiteSettings } from "@/app/admin/actions/settingsActions";
import { getHero } from "@/app/admin/actions/heroActions";
import Contact from "@/components/public/Contact";

export const revalidate = 60;

export default async function ContactPage() {
  const [settings, hero] = await Promise.all([
    getSiteSettings().catch(() => null),
    getHero().catch(() => null)
  ]);
  const socialLinks = settings?.socialLinks || hero?.socialLinks || [];

  return (
    <div className="flex flex-col min-h-full">
      <Contact 
        socialLinks={socialLinks} 
        contactEmail={settings?.contactEmail}
        contactLocation={settings?.contactLocation}
      />
    </div>
  );
}
