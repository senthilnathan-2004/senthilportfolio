import type { Metadata } from "next";
import "@/app/globals.css";
import { getSiteSettings } from "@/app/admin/actions/settingsActions";
import PublicSidebar from "@/components/public/PublicSidebar";
import PublicMobileNav from "@/components/public/PublicMobileNav";
import TopBreadcrumbNavbar from "@/components/public/TopBreadcrumbNavbar";
import Footer from "@/components/public/Footer";
import ScrollToTop from "@/components/public/ScrollToTop";
import Preloader from "@/components/public/Preloader";
import WelcomeCard from "@/components/public/WelcomeCard";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  
  return {
    title: "Senthilragu Developer Portfolio",
    description: "Full stack developer & UI designer building fast, scalable, and secure digital experiences.",
    keywords: ["developer", "portfolio", "full-stack", "web development", "UI design"],
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
    } : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: "Senthilragu — Developer Portfolio",
      description: "Full-stack developer & UI designer building fast, scalable, and secure digital experiences.",
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);

  const logoText = settings?.logoText || "// Senthilragu";
  const footerText = settings?.footerText || "© {year} Senthilragu. All rights reserved.";
  const socialLinks = settings?.socialLinks || [];
  const startupName = settings?.startupName || "";
  const startupUrl = settings?.startupUrl || "";
  
  // Force all navigation links to ensure 7 pages are displayed
  const forcedNavLinks = [
    { label: "Home", href: "/", order: 1 },
    { label: "About", href: "/about", order: 2 },
    { label: "Skills", href: "/skills", order: 3 },
    { label: "Projects", href: "/projects", order: 4 },
    { label: "Services", href: "/services", order: 5 },
    { label: "Testimonials", href: "/testimonials", order: 6 },
    { label: "Contact", href: "/contact", order: 7 },
  ];

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased flex flex-col lg:flex-row min-h-screen relative font-mono">
        <Preloader />
        <WelcomeCard name={logoText.replace("//", "").trim()} />
        
        {/* Desktop Sidebar Card Wrapper */}
        <div className="hidden lg:flex p-4 lg:p-8 xl:p-10 lg:pr-3 xl:pr-4 h-screen z-10 relative shrink-0">
          <PublicSidebar logoText={logoText} navLinks={forcedNavLinks} socialLinks={socialLinks} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent px-2 pt-4 pb-24 sm:p-4 sm:pb-24 lg:p-8 lg:pl-3 xl:p-10 xl:pl-4 h-screen overflow-hidden z-10 relative">
          <main className="flex-1 bg-bg-primary/95 backdrop-blur-xl border border-border-subtle rounded-3xl shadow-card flex flex-col overflow-hidden relative">
            <TopBreadcrumbNavbar />
            <div id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden relative">
              {children}
              <div className="mt-8 border-t border-border-subtle/50">
                <Footer
                  logoText={logoText}
                  footerText={footerText}
                  quickLinks={forcedNavLinks}
                  socialLinks={socialLinks}
                  startupName={startupName}
                  startupUrl={startupUrl}
                />
              </div>
            </div>
          </main>
        </div>
        
        <PublicMobileNav navLinks={forcedNavLinks} />
        <ScrollToTop />
      </body>
    </html>
  );
}
