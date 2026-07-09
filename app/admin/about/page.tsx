"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAbout, updateAbout } from "@/app/admin/actions/aboutActions";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, Loader2, CheckCircle, Download } from "lucide-react";

const aboutSchema = z.object({ tagLabel: z.string().min(1) });
type AboutForm = z.infer<typeof aboutSchema>;

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bioHtml, setBioHtml] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileId, setImageFileId] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [cvFileId, setCvFileId] = useState("");

  const { register, handleSubmit, reset } = useForm<AboutForm>({ resolver: zodResolver(aboutSchema) });

  useEffect(() => {
    getAbout().then((data) => {
      if (data) {
        reset({ tagLabel: data.tagLabel || "<About>" });
        setBioHtml(data.bioRichText || "");
        setImageUrl(data.imageUrl || "");
        setImageFileId(data.imageFileId || "");
        setCvUrl(data.cvUrl || "");
        setCvFileId(data.cvFileId || "");
      }
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: AboutForm) => {
    setSaving(true);
    await updateAbout({ ...data, bioRichText: bioHtml, imageUrl, imageFileId, cvUrl, cvFileId });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8 w-full">
      <div className="mb-6">
        <span className="font-mono text-green-accent text-sm">// about</span>
        <h1 className="text-2xl font-display text-text-primary mt-1">Edit About Section</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Tag Label</label>
          <input
            {...register("tagLabel")}
            placeholder="<About>"
            className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Bio (Rich Text)</label>
          <RichTextEditor value={bioHtml} onChange={setBioHtml} />
        </div>

        <ImageUploader
          value={imageUrl}
          fileId={imageFileId}
          label="About Photo (optional)"
          folder="/portfolio/about"
          onUpload={(url, fid) => { setImageUrl(url); setImageFileId(fid); }}
          onDelete={() => { setImageUrl(""); setImageFileId(""); }}
        />

        {/* CV upload */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">CV / Resume PDF (optional)</label>
          {cvUrl ? (
            <div className="flex items-center gap-3 p-4 bg-bg-card border border-border-subtle rounded-2xl">
              <Download size={16} className="text-green-accent" />
              <a href={cvUrl} target="_blank" className="text-green-accent font-mono text-sm hover:underline flex-1">
                View CV
              </a>
              <button
                type="button"
                onClick={() => { setCvUrl(""); setCvFileId(""); }}
                className="text-xs text-red-400 hover:text-red-300 font-mono"
              >
                Remove
              </button>
            </div>
          ) : (
            <ImageUploader
              label=""
              folder="/portfolio/cv"
              accept=".pdf,application/pdf,image/*"
              onUpload={(url, fid) => { setCvUrl(url); setCvFileId(fid); }}
            />
          )}
        </div>

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
