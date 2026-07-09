import { getDashboardStats } from "@/app/admin/actions/settingsActions";
import { getProjects } from "@/app/admin/actions/projectActions";
import { FolderKanban, MessageSquare, Star, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [stats, projects] = await Promise.all([
    getDashboardStats().catch(() => ({ projectCount: 0, unreadCount: 0 })),
    getProjects().catch(() => []),
  ]);

  const featuredCount = projects.filter((p: { featured: boolean }) => p.featured).length;

  const quickLinks = [
    { href: "/admin/hero", label: "Edit Hero", desc: "Update headline, portrait, badge" },
    { href: "/admin/projects", label: "Manage Projects", desc: "Add, edit, reorder projects" },
    { href: "/admin/messages", label: "View Messages", desc: `${stats.unreadCount} unread`, urgent: stats.unreadCount > 0 },
    { href: "/admin/settings", label: "Settings", desc: "Nav, footer, password" },
  ];

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-green-accent text-sm">// dashboard</span>
        </div>
        <h1 className="text-3xl font-display text-text-primary">Welcome back</h1>
        <p className="text-text-secondary font-mono text-sm mt-1">
          Your portfolio CMS — edit any section and it goes live instantly.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-bg-card border border-border-subtle rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-accent/10 rounded-xl">
              <FolderKanban size={18} className="text-green-accent" />
            </div>
            <span className="font-mono text-sm text-text-secondary">Total Projects</span>
          </div>
          <p className="text-4xl font-display text-text-primary">{stats.projectCount}</p>
          <p className="text-xs text-text-tertiary font-mono mt-1">{featuredCount} featured</p>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl ${stats.unreadCount > 0 ? "bg-yellow-500/10" : "bg-green-accent/10"}`}>
              <MessageSquare size={18} className={stats.unreadCount > 0 ? "text-yellow-400" : "text-green-accent"} />
            </div>
            <span className="font-mono text-sm text-text-secondary">Unread Messages</span>
          </div>
          <p className="text-4xl font-display text-text-primary">{stats.unreadCount}</p>
          <Link href="/admin/messages" className="text-xs text-green-accent font-mono mt-1 hover:underline inline-block">
            View inbox →
          </Link>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-accent/10 rounded-xl">
              <Star size={18} className="text-green-accent" />
            </div>
            <span className="font-mono text-sm text-text-secondary">Featured</span>
          </div>
          <p className="text-4xl font-display text-text-primary">{featuredCount}</p>
          <p className="text-xs text-text-tertiary font-mono mt-1">highlighted projects</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="font-mono text-text-secondary text-sm mb-4">// quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ href, label, desc, urgent }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 p-4 bg-bg-card border border-border-subtle rounded-2xl hover:border-green-accent/30 transition-all hover:bg-bg-card/80"
            >
              <div className={`p-2 rounded-xl ${urgent ? "bg-yellow-500/10" : "bg-green-accent/10"}`}>
                <Zap size={16} className={urgent ? "text-yellow-400" : "text-green-accent"} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                <p className="text-xs text-text-tertiary font-mono">{desc}</p>
              </div>
              <ArrowRight size={14} className="text-text-tertiary group-hover:text-green-accent transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      {projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-text-secondary text-sm">// recent projects</h2>
            <Link href="/admin/projects" className="text-xs text-green-accent font-mono hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {projects.slice(0, 5).map((p: { _id: string; title: string; category: string; featured: boolean }) => (
              <Link
                key={p._id}
                href={`/admin/projects/${p._id}/edit`}
                className="flex items-center gap-4 p-4 bg-bg-card border border-border-subtle rounded-2xl hover:border-green-accent/30 transition-all group"
              >
                <div className="flex-1">
                  <p className="text-sm text-text-primary font-semibold">{p.title}</p>
                  <p className="text-xs text-text-tertiary font-mono">{p.category}</p>
                </div>
                {p.featured && (
                  <span className="text-xs font-mono text-green-accent bg-green-accent/10 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-green-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
