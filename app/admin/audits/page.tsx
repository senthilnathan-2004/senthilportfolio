"use client";

import { useState, useEffect } from "react";
import {
  getAdminAudits,
  createAudit,
  updateAudit,
  deleteAudit,
} from "@/app/admin/actions/auditActions";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  Plus,
  Trash2,
  Loader2,
  Save,
  CheckCircle,
  ShieldCheck,
  Zap,
  Search,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface AuditProofItem {
  _id: string;
  title: string;
  category: "Security" | "Performance" | "SEO" | "Ranking";
  badgeText: string;
  scoreOrMetric: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
  imageAlt: string;
  pdfUrl?: string;
  externalLink?: string;
  featured: boolean;
  order: number;
}

const CATEGORIES = ["Security", "Performance", "SEO", "Ranking"] as const;

export default function AdminAuditsPage() {
  const [audits, setAudits] = useState<AuditProofItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    getAdminAudits().then((data) => {
      setAudits(data || []);
      setLoading(false);
    });
  }, []);

  const showSaved = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleAddAudit = async () => {
    const newItem = await createAudit({
      title: "New Audit & Proof Report",
      category: "Performance",
      badgeText: "Verified Benchmark",
      scoreOrMetric: "100%",
      description: "Detailed breakdown of the audit report, benchmark results, and verification metrics.",
      imageUrl: "",
      imageFileId: "",
      imageAlt: "Audit Report Screenshot",
      pdfUrl: "",
      externalLink: "",
      featured: true,
    });
    setAudits((prev) => [...prev, newItem]);
  };

  const handleSaveAudit = async (item: AuditProofItem) => {
    setSaving(item._id);
    await updateAudit(item._id, {
      title: item.title,
      category: item.category,
      badgeText: item.badgeText,
      scoreOrMetric: item.scoreOrMetric,
      description: item.description,
      imageUrl: item.imageUrl,
      imageFileId: item.imageFileId,
      imageAlt: item.imageAlt,
      pdfUrl: item.pdfUrl,
      externalLink: item.externalLink,
      featured: item.featured,
    });
    setSaving(null);
    showSaved(item._id);
  };

  const updateField = (
    id: string,
    field: keyof AuditProofItem,
    value: string | number | boolean
  ) => {
    setAudits((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this audit proof?")) return;
    await deleteAudit(id);
    setAudits((prev) => prev.filter((item) => item._id !== id));
  };

  // Quick Seed Default Data matching the user's uploaded images
  const seedDefaults = async () => {
    setSeeding(true);
    const defaults = [
      {
        title: "Grade 'A' Enterprise Security Compliance",
        category: "Security" as const,
        badgeText: "🔒 Grade A Verified",
        scoreOrMetric: "Grade A",
        description:
          "Zero critical vulnerabilities with CSP, HSTS, X-Content-Type-Options, and safe browsing headers enabled.",
        imageUrl: "",
        pdfUrl: "",
        externalLink: "https://crestophysio.com/",
        featured: true,
      },
      {
        title: "High-Concurrency Stress & Load Resilience",
        category: "Performance" as const,
        badgeText: "⚡ 0.00% Failure Rate",
        scoreOrMetric: "8,645 Req / 0% Err",
        description:
          "k6 stress test with 100 concurrent Virtual Users handling 8.6k+ requests at 260ms median latency.",
        imageUrl: "",
        pdfUrl: "",
        externalLink: "",
        featured: true,
      },
      {
        title: "Google Search & Local Maps #1 Ranking",
        category: "Ranking" as const,
        badgeText: "🏆 Google #1 Rank",
        scoreOrMetric: "Top 1 Organic",
        description:
          "Dominant Google Search and 3-Pack Maps visibility in Bengaluru for competitive medical services.",
        imageUrl: "",
        pdfUrl: "",
        externalLink: "https://crestophysio.com/",
        featured: true,
      },
      {
        title: "99/100 AIOSEO Performance & Schema Audit",
        category: "SEO" as const,
        badgeText: "⭐ 99/100 Score",
        scoreOrMetric: "99 / 100",
        description:
          "AIOSEO full audit with under 0.2s TTFB response time, validated Schema.org metadata, and complete Core Web Vitals.",
        imageUrl: "",
        pdfUrl: "",
        externalLink: "https://crestophysio.com/",
        featured: true,
      },
    ];

    for (const d of defaults) {
      const created = await createAudit(d);
      setAudits((prev) => [...prev, created]);
    }
    setSeeding(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="text-green-accent animate-spin" size={32} />
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors";

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-green-accent text-sm">// benchmarks & proofs</span>
            <span className="px-2 py-0.5 bg-green-accent/10 border border-green-accent/20 rounded-md text-xs font-mono text-green-accent">
              Option 1 Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-text-primary mt-1">
            Verified Performance & Security Audits
          </h1>
          <p className="text-xs sm:text-sm font-mono text-text-secondary mt-1">
            Manage your SEO reports, security compliance certificates, Google ranking proofs, and load-test results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {audits.length === 0 && (
            <button
              onClick={seedDefaults}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl font-mono text-xs sm:text-sm hover:bg-blue-500/20 transition-colors"
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {seeding ? "Generating..." : "Auto-Populate 4 Proof Cards"}
            </button>
          )}
          <button
            onClick={handleAddAudit}
            className="flex items-center gap-2 px-4 py-2 bg-green-accent text-bg-primary rounded-xl font-mono font-semibold text-xs sm:text-sm hover:bg-green-accent/90 transition-colors shadow-lg shadow-green-accent/10"
          >
            <Plus size={16} /> Add Audit Proof
          </button>
        </div>
      </div>

      {/* List of Audits */}
      <div className="space-y-6">
        {audits.length === 0 ? (
          <div className="p-12 text-center bg-bg-card border border-dashed border-border-subtle rounded-3xl space-y-4">
            <ShieldCheck size={48} className="mx-auto text-text-tertiary" />
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-text-primary">No Audits or Proofs Added Yet</h3>
              <p className="text-xs font-mono text-text-secondary mt-1">
                Click &ldquo;Auto-Populate 4 Proof Cards&rdquo; above to quickly load the Security, Load Test, Google Rank, and SEO templates, then upload your screenshots.
              </p>
            </div>
          </div>
        ) : (
          audits.map((item) => (
            <div
              key={item._id}
              className={`p-6 bg-bg-card border ${
                item.featured ? "border-border-subtle" : "border-amber-500/40 bg-amber-500/5"
              } rounded-3xl space-y-5 transition-all shadow-md`}
            >
              {/* Card Top Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-md font-semibold ${
                      item.featured
                        ? "bg-green-accent/10 text-green-accent border border-green-accent/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.featured ? "● LIVE ON HOMEPAGE" : "○ HIDDEN"}
                  </span>
                  <span className="text-xs font-mono text-text-tertiary">
                    Category: <strong className="text-text-primary">{item.category}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={(e) => updateField(item._id, "featured", e.target.checked)}
                      className="accent-green-accent w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-text-secondary">Show on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Image / Screenshot Uploader */}
                <div className="lg:col-span-4 space-y-2">
                  <label className="text-xs font-mono text-text-secondary block">
                    Audit Screenshot / Proof Image
                  </label>
                  <ImageUploader
                    value={item.imageUrl}
                    fileId={item.imageFileId}
                    alt={item.title}
                    label=""
                    folder="/portfolio/audits"
                    previewHeight="h-52"
                    onUpload={(url, fid) => {
                      updateField(item._id, "imageUrl", url);
                      updateField(item._id, "imageFileId", fid);
                    }}
                    onDelete={() => {
                      updateField(item._id, "imageUrl", "");
                      updateField(item._id, "imageFileId", "");
                    }}
                  />
                  <input
                    value={item.imageAlt}
                    onChange={(e) => updateField(item._id, "imageAlt", e.target.value)}
                    placeholder="Image Alt Text (e.g. k6 load test results)"
                    className={`${inputClass} text-xs`}
                  />
                </div>

                {/* Right: Metadata Inputs */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-mono text-text-secondary">Report Title</label>
                      <input
                        value={item.title}
                        onChange={(e) => updateField(item._id, "title", e.target.value)}
                        placeholder="e.g. Grade 'A' Enterprise Security Compliance"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          updateField(
                            item._id,
                            "category",
                            e.target.value as AuditProofItem["category"]
                          )
                        }
                        className={inputClass}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Badge Text & Metric Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">
                        Badge Text (Pill tag)
                      </label>
                      <input
                        value={item.badgeText}
                        onChange={(e) => updateField(item._id, "badgeText", e.target.value)}
                        placeholder="e.g. 🔒 Grade A Verified"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">
                        Highlight Metric / Score
                      </label>
                      <input
                        value={item.scoreOrMetric}
                        onChange={(e) => updateField(item._id, "scoreOrMetric", e.target.value)}
                        placeholder="e.g. 99/100 Score or 0.00% Err"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-text-secondary">
                      Summary Description (Key takeaways & technical details)
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateField(item._id, "description", e.target.value)}
                      placeholder="Explain the results (e.g. Sub-second response times, CSP and HSTS configured, top Google ranking)..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* PDF URL & External Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
                        <FileText size={12} className="text-blue-400" />
                        PDF Audit File URL (Optional)
                      </label>
                      <input
                        value={item.pdfUrl || ""}
                        onChange={(e) => updateField(item._id, "pdfUrl", e.target.value)}
                        placeholder="https://... or /reports/seo-audit.pdf"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
                        <ExternalLink size={12} className="text-green-accent" />
                        External Live Audit Link (Optional)
                      </label>
                      <input
                        value={item.externalLink || ""}
                        onChange={(e) => updateField(item._id, "externalLink", e.target.value)}
                        placeholder="https://crestophysio.com/"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 font-mono hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={14} /> Delete Card
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveAudit(item)}
                  disabled={saving === item._id}
                  className="flex items-center gap-2 px-5 py-2 bg-green-accent text-bg-primary rounded-xl font-mono font-semibold text-xs sm:text-sm hover:bg-green-accent/90 transition-all shadow-md shadow-green-accent/10"
                >
                  {saving === item._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : saved === item._id ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  {saving === item._id ? "Saving..." : saved === item._id ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
