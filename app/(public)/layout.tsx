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
import { Archivo_Black, JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  
  return {
    title: "Senthilnathan R — Full Stack MERN Developer Portfolio",
    description: "Full Stack MERN Developer with experience building scalable web applications, RESTful APIs, and reusable UI component systems.",
    keywords: ["Senthilnathan R", "Full Stack Developer", "MERN Stack", "React.js", "Node.js", "MongoDB", "Express.js", "Software Engineer"],
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
    } : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: "Senthilnathan R — Full Stack MERN Developer",
      description: "Full Stack MERN Developer with experience building scalable web applications, RESTful APIs, and reusable UI component systems.",
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null);

  const logoText = settings?.logoText || "// Senthilnathan R";
  const footerText = settings?.footerText || "© {year} Senthilnathan R. All rights reserved.";
  const socialLinks = settings?.socialLinks || [];
  const startupName = settings?.startupName || "";
  const startupUrl = settings?.startupUrl || "";
  
  // Clean job portfolio navigation links (5 essential pages)
  const forcedNavLinks = [
    { label: "Home", href: "/", order: 1 },
    { label: "About", href: "/about", order: 2 },
    { label: "Skills", href: "/skills", order: 3 },
    { label: "Projects", href: "/projects", order: 4 },
    { label: "Contact", href: "/contact", order: 5 },
  ];

  return (
    <html 
      lang="en" 
      className={`dark scroll-smooth ${archivoBlack.variable} ${jetbrainsMono.variable} ${inter.variable}`} 
      suppressHydrationWarning
    >
      <body className="bg-bg-primary text-text-primary antialiased flex flex-col lg:flex-row min-h-screen relative font-mono" suppressHydrationWarning>
        <Preloader />
        <WelcomeCard name={logoText.replace("//", "").trim()} />
        
        {/* Desktop Sidebar Card Wrapper */}
        <div className="hidden lg:flex p-4 lg:p-8 xl:p-10 lg:pr-3 xl:pr-4 h-screen z-10 relative shrink-0">
          <PublicSidebar logoText={logoText} navLinks={forcedNavLinks} socialLinks={socialLinks} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent px-2 pt-4 pb-24 sm:p-4 sm:pb-24 lg:p-8 lg:pl-3 xl:p-10 xl:pl-4 h-screen overflow-hidden z-10 relative">
          <main className="flex-1 bg-bg-primary/95 backdrop-blur-xl border border-border-subtle rounded-3xl flex flex-col overflow-hidden relative">
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
        <Analytics />
      </body>
    </html>
  );
}
