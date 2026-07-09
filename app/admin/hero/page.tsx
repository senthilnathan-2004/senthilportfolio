"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getHero, updateHero } from "@/app/admin/actions/heroActions";
import ImageUploader from "@/components/admin/ImageUploader";
import { Plus, Trash2, Save, Loader2, GripVertical, CheckCircle } from "lucide-react";

const heroSchema = z.object({
  badgeText: z.string().min(1),
  headline: z.string().min(1),
  captionName: z.string().min(1),
  portraitAlt: z.string(),
});

type HeroForm = z.infer<typeof heroSchema>;

interface SocialLink { platform: string; url: string; order: number; }

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState("");
  const [portraitFileId, setPortraitFileId] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HeroForm>({
    resolver: zodResolver(heroSchema),
  });

  useEffect(() => {
    getHero().then((data) => {
      if (data) {
        reset({
          badgeText: data.badgeText || "",
          headline: data.headline || "",
          captionName: data.captionName || "",
          portraitAlt: data.portraitAlt || "",
        });
        setPortraitUrl(data.portraitImageUrl || "");
        setPortraitFileId(data.portraitImageFileId || "");
        setSocialLinks(data.socialLinks || []);
      }
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: HeroForm) => {
    setSaving(true);
    await updateHero({
      ...data,
      portraitImageUrl: portraitUrl,
      portraitImageFileId: portraitFileId,
      socialLinks: socialLinks.map((s, i) => ({ ...s, order: i })),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: "", url: "", order: socialLinks.length }]);
  const removeSocialLink = (i: number) => setSocialLinks(socialLinks.filter((_, idx) => idx !== i));
  const updateSocialLink = (i: number, field: keyof SocialLink, value: string) => {
    setSocialLinks(socialLinks.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8 w-full">
      <div className="mb-6">
        <span className="font-mono text-green-accent text-sm">// hero</span>
        <h1 className="text-2xl font-display text-text-primary mt-1">Edit Hero Section</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Badge */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Badge Text</label>
          <input
            {...register("badgeText")}
            placeholder="<6+ Year Experience>"
            className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
          />
          {errors.badgeText && <p className="text-xs text-red-400 font-mono mt-1">{errors.badgeText.message}</p>}
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">
            Hero Headline <span className="text-text-tertiary">(use \n for line breaks)</span>
          </label>
          <textarea
            {...register("headline")}
            rows={4}
            placeholder={"BUILDING FAST,\nSCALABLE, AND\nSECURE WEBSITE"}
            className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-display text-sm focus:border-green-accent focus:outline-none transition-colors resize-none uppercase"
          />
          {errors.headline && <p className="text-xs text-red-400 font-mono mt-1">{errors.headline.message}</p>}
        </div>

        {/* Portrait */}
        <ImageUploader
          value={portraitUrl}
          fileId={portraitFileId}
          alt="Portrait"
          label="Portrait Image"
          folder="/portfolio/portraits"
          onUpload={(url, fileId) => { setPortraitUrl(url); setPortraitFileId(fileId); }}
          onDelete={() => { setPortraitUrl(""); setPortraitFileId(""); }}
        />

        {/* Caption + Alt */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Caption Name</label>
            <input
              {...register("captionName")}
              placeholder="Alex Rivera"
              className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Portrait Alt Text</label>
            <input
              {...register("portraitAlt")}
              placeholder="Developer portrait"
              className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-mono text-text-secondary">Social Links</label>
            <button type="button" onClick={addSocialLink} className="flex items-center gap-1.5 text-xs font-mono text-green-accent hover:underline">
              <Plus size={12} /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-bg-card border border-border-subtle rounded-2xl">
                <GripVertical size={14} className="text-text-tertiary cursor-grab" />
                <input
                  value={link.platform}
                  onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                  placeholder="Platform (e.g. Instagram)"
                  className="flex-1 bg-transparent text-text-primary font-mono text-sm focus:outline-none placeholder:text-text-tertiary"
                />
                <span className="text-text-tertiary font-mono text-sm">→</span>
                <input
                  value={link.url}
                  onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-transparent text-text-secondary font-mono text-sm focus:outline-none placeholder:text-text-tertiary"
                />
                <button type="button" onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
