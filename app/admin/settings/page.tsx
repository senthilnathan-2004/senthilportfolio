"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSiteSettings, updateSiteSettings, changePassword, updateAdminEmail } from "@/app/admin/actions/settingsActions";
import { Save, Loader2, CheckCircle, Plus, Trash2, Lock, Globe, Mail, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface NavLink { label: string; href: string; order: number; }
interface SocialLink { platform: string; url: string; order: number; }

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoText, setLogoText] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [footerText, setFooterText] = useState("");
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [faviconFileId, setFaviconFileId] = useState("");
  const [startupName, setStartupName] = useState("");
  const [startupUrl, setStartupUrl] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email change
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminEmailPassword, setAdminEmailPassword] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) {
        setLogoText(data.logoText || "// Senthilragu");
        setCtaText(data.ctaText || "Let's Collaborate");
        setCtaHref(data.ctaHref || "#contact");
        setFooterText(data.footerText || "© {year} Senthilragu. All rights reserved.");
        setNavLinks(data.navLinks || []);
        setSocialLinks(data.socialLinks || []);
        setContactEmail(data.contactEmail || "hello@example.com");
        setContactLocation(data.contactLocation || "Earth, Local Cluster");
        setFaviconUrl(data.faviconUrl || "");
        setFaviconFileId(data.faviconFileId || "");
        setStartupName(data.startupName || "");
        setStartupUrl(data.startupUrl || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateSiteSettings({
      logoText, ctaText, ctaHref, footerText,
      navLinks: navLinks.map((n, i) => ({ ...n, order: i })),
      socialLinks: socialLinks.map((s, i) => ({ ...s, order: i })),
      contactEmail, contactLocation, faviconUrl, faviconFileId,
      startupName, startupUrl
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = async () => {
    if (!session?.user?.email) return;
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    setPwSaving(true);
    const result = await changePassword(session.user.email, currentPassword, newPassword);
    setPwSaving(false);
    if (result.error) {
      setPwMsg({ type: "error", text: result.error });
    } else {
      setPwMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
    setTimeout(() => setPwMsg(null), 4000);
  };

  const handleChangeEmail = async () => {
    if (!session?.user?.email) return;
    if (!newAdminEmail || !newAdminEmail.includes("@")) {
      setEmailMsg({ type: "error", text: "Please enter a valid email" });
      return;
    }
    setEmailSaving(true);
    const result = await updateAdminEmail(session.user.email, newAdminEmail, adminEmailPassword);
    setEmailSaving(false);
    if (result.error) {
      setEmailMsg({ type: "error", text: result.error });
    } else {
      setEmailMsg({ type: "success", text: "Email updated successfully! Please log in again." });
      setNewAdminEmail(""); setAdminEmailPassword("");
    }
    setTimeout(() => setEmailMsg(null), 4000);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  const inputClass = "w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors";

  return (
    <div className="p-8 w-full space-y-10">
      {/* Site Settings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Globe size={18} className="text-green-accent" />
          <div>
            <span className="font-mono text-green-accent text-sm">// settings</span>
            <h1 className="text-2xl font-display text-text-primary mt-1">Site Settings</h1>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Logo Text</label>
            <input value={logoText} onChange={(e) => setLogoText(e.target.value)} placeholder="// Senthilragu" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">CTA Button Text</label>
              <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Let's Collaborate" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">CTA Button Link</label>
              <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} placeholder="#contact" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Footer Text <span className="text-text-tertiary">(use {"{year}"} for auto-year)</span></label>
            <input value={footerText} onChange={(e) => setFooterText(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">Startup Name (Footer Link)</label>
              <input value={startupName} onChange={(e) => setStartupName(e.target.value)} placeholder="e.g. My Awesome Startup" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">Startup URL</label>
              <input value={startupUrl} onChange={(e) => setStartupUrl(e.target.value)} placeholder="https://example.com" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">Contact Email</label>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="hello@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-mono text-text-secondary mb-2">Base Coordinates</label>
              <input value={contactLocation} onChange={(e) => setContactLocation(e.target.value)} placeholder="Earth, Local Cluster" className={inputClass} />
            </div>
          </div>

          {/* Favicon */}
          <div className="pt-2">
            <ImageUploader
              value={faviconUrl}
              fileId={faviconFileId}
              alt="Favicon"
              label="Site Favicon (Browser Icon)"
              folder="/portfolio/settings"
              onUpload={(url, fileId) => { setFaviconUrl(url); setFaviconFileId(fileId); }}
              onDelete={() => { setFaviconUrl(""); setFaviconFileId(""); }}
            />
          </div>

          {/* Nav Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-text-secondary">Nav Links</label>
              <button onClick={() => setNavLinks([...navLinks, { label: "", href: "#", order: navLinks.length }])} className="text-xs font-mono text-green-accent hover:underline flex items-center gap-1">
                <Plus size={11} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {navLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input value={link.label} onChange={(e) => setNavLinks(navLinks.map((n, idx) => idx === i ? { ...n, label: e.target.value } : n))} placeholder="Label" className="flex-1 px-3 py-2 bg-bg-card border border-border-subtle rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none" />
                  <input value={link.href} onChange={(e) => setNavLinks(navLinks.map((n, idx) => idx === i ? { ...n, href: e.target.value } : n))} placeholder="#section" className="flex-1 px-3 py-2 bg-bg-card border border-border-subtle rounded-xl text-text-secondary font-mono text-sm focus:border-green-accent focus:outline-none" />
                  <button onClick={() => setNavLinks(navLinks.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-text-secondary">Social Links</label>
              <button onClick={() => setSocialLinks([...socialLinks, { platform: "", url: "#", order: socialLinks.length }])} className="text-xs font-mono text-green-accent hover:underline flex items-center gap-1">
                <Plus size={11} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input value={link.platform} onChange={(e) => setSocialLinks(socialLinks.map((s, idx) => idx === i ? { ...s, platform: e.target.value } : s))} placeholder="Platform" className="flex-1 px-3 py-2 bg-bg-card border border-border-subtle rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none" />
                  <input value={link.url} onChange={(e) => setSocialLinks(socialLinks.map((s, idx) => idx === i ? { ...s, url: e.target.value } : s))} placeholder="https://..." className="flex-1 px-3 py-2 bg-bg-card border border-border-subtle rounded-xl text-text-secondary font-mono text-sm focus:border-green-accent focus:outline-none" />
                  <button onClick={() => setSocialLinks(socialLinks.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </section>

      {/* Change Password */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Lock size={18} className="text-green-accent" />
          <div>
            <span className="font-mono text-green-accent text-sm">// security</span>
            <h2 className="text-2xl font-display text-text-primary mt-1">Change Password</h2>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          {pwMsg && (
            <div className={`p-3 rounded-xl border text-sm font-mono ${pwMsg.type === "success" ? "bg-green-accent/10 border-green-accent/30 text-green-accent" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
              {pwMsg.text}
            </div>
          )}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Current Password</label>
            <div className="relative">
              <input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClass} pr-10`} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-green-accent transition-colors">
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">New Password</label>
            <div className="relative">
              <input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pr-10`} placeholder="Min 8 characters" />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-green-accent transition-colors">
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Confirm New Password</label>
            <div className="relative">
              <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pr-10`} placeholder="Repeat new password" />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-green-accent transition-colors">
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword} className="flex items-center gap-2 px-6 py-3 bg-green-accent/10 text-green-accent border border-green-accent/30 font-mono font-bold rounded-full hover:bg-green-accent/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {pwSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            {pwSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </section>

      {/* Change Admin Email */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Mail size={18} className="text-green-accent" />
          <div>
            <span className="font-mono text-green-accent text-sm">// security</span>
            <h2 className="text-2xl font-display text-text-primary mt-1">Change Login Email</h2>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          {emailMsg && (
            <div className={`p-3 rounded-xl border text-sm font-mono ${emailMsg.type === "success" ? "bg-green-accent/10 border-green-accent/30 text-green-accent" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
              {emailMsg.text}
            </div>
          )}
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">New Admin Email</label>
            <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className={inputClass} placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Current Password</label>
            <div className="relative">
              <input type={showPasswords ? "text" : "password"} value={adminEmailPassword} onChange={(e) => setAdminEmailPassword(e.target.value)} className={`${inputClass} pr-10`} placeholder="Verify your password" />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-green-accent transition-colors">
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button onClick={handleChangeEmail} disabled={emailSaving || !newAdminEmail || !adminEmailPassword} className="flex items-center gap-2 px-6 py-3 bg-green-accent/10 text-green-accent border border-green-accent/30 font-mono font-bold rounded-full hover:bg-green-accent/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {emailSaving ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            {emailSaving ? "Updating..." : "Update Email"}
          </button>
        </div>
      </section>
    </div>
  );
}
