import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getDashboardStats } from "@/app/admin/actions/settingsActions";
import Providers from "@/components/Providers";
import "@/app/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await import("@/app/admin/actions/settingsActions").then(m => m.getSiteSettings()).catch(() => null);
  return {
    title: "Admin Panel — Portfolio CMS",
    robots: { index: false, follow: false },
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
    } : undefined,
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const stats = await getDashboardStats().catch(() => ({ projectCount: 0, unreadCount: 0 }));

  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary">
        <Providers>
          <div className="flex flex-col md:flex-row min-h-screen pb-16 md:pb-0">
            <AdminSidebar unreadCount={stats.unreadCount} />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
