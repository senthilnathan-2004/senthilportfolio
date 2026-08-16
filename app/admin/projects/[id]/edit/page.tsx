"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById, updateProject } from "@/app/admin/actions/projectActions";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, Loader2, CheckCircle, Plus, Trash2, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PRESET_CATEGORIES = [
  "Web Development",
  "Landing Page",
  "Mobile App",
  "UI/UX Design",
  "Full Stack",
  "Backend",
  "Frontend",
  "DevOps",
  "Custom / Other",
];

interface GalleryItem { url: string; fileId: string; alt: string; order: number; }

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [project, setProject] = useState<{
    title: string; slug: string; coverImageUrl: string; coverImageFileId: string; coverImageAlt: string;
    gallery: GalleryItem[]; shortDescription: string; caseStudyRichText: string; techTags: string[];
    liveUrl: string; githubUrl: string; category: string; featured: boolean;
  }>({
    title: "", slug: "", coverImageUrl: "", coverImageFileId: "", coverImageAlt: "",
    gallery: [], shortDescription: "", caseStudyRichText: "", techTags: [],
    liveUrl: "", githubUrl: "", category: "Web Development", featured: false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    getProjectById(id).then((data) => {
      if (data) {
        setProject(data);
        const isPreset = PRESET_CATEGORIES.slice(0, -1).includes(data.category);
        if (!isPreset && data.category) {
          setIsCustomCategory(true);
        }
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await updateProject(id, project);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addTag = () => {
    if (tagInput.trim() && !project.techTags.includes(tagInput.trim())) {
      setProject({ ...project, techTags: [...project.techTags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setProject({ ...project, techTags: project.techTags.filter(t => t !== tag) });
  };

  const addGalleryImage = (url: string, fileId: string) => {
    setProject({ ...project, gallery: [...project.gallery, { url, fileId, alt: "", order: project.gallery.length }] });
  };

  const removeGalleryImage = (i: number) => {
    setProject({ ...project, gallery: project.gallery.filter((_, idx) => idx !== i) });
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8 w-full">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/projects" className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <span className="font-mono text-green-accent text-sm">// edit project</span>
          <h1 className="text-2xl font-display text-text-primary mt-1">{project.title || "Untitled Project"}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Project Title *</label>
          <input
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="My Awesome Project"
            className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-sans text-sm focus:border-green-accent focus:outline-none transition-colors"
          />
        </div>

        {/* Short description */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Short Description</label>
          <textarea
            value={project.shortDescription}
            onChange={(e) => setProject({ ...project, shortDescription: e.target.value })}
            rows={3}
            placeholder="A brief description shown on the project card..."
            className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-sans text-sm focus:border-green-accent focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Category + Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Category</label>
            <select
              value={isCustomCategory ? "Custom / Other" : project.category}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "Custom / Other") {
                  setIsCustomCategory(true);
                  if (PRESET_CATEGORIES.slice(0, -1).includes(project.category)) {
                    setProject({ ...project, category: "" });
                  }
                } else {
                  setIsCustomCategory(false);
                  setProject({ ...project, category: val });
                }
              }}
              className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
            >
              {PRESET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Custom Category Input */}
            {isCustomCategory && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => setProject({ ...project, category: e.target.value })}
                  placeholder="Enter custom category name (e.g. Landing Page, SaaS...)"
                  className="w-full px-4 py-2.5 bg-bg-card border border-green-accent/40 rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Featured</label>
            <button
              type="button"
              onClick={() => setProject({ ...project, featured: !project.featured })}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all w-full font-mono text-sm ${
                project.featured
                  ? "bg-green-accent/10 border-green-accent/40 text-green-accent"
                  : "bg-bg-card border-border-subtle text-text-secondary"
              }`}
            >
              <Star size={14} className={project.featured ? "fill-green-accent" : ""} />
              {project.featured ? "Featured" : "Not Featured"}
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">Live URL</label>
            <input
              value={project.liveUrl}
              onChange={(e) => setProject({ ...project, liveUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-text-secondary mb-2">GitHub URL</label>
            <input
              value={project.githubUrl}
              onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-4 py-3 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tech Tags */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Tech Tags</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {project.techTags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-green-accent/10 text-green-accent border border-green-accent/20 rounded-full text-xs font-mono">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors"><Trash2 size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag (press Enter)"
              className="flex-1 px-4 py-2.5 bg-bg-card border border-border-subtle rounded-2xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none"
            />
            <button onClick={addTag} className="p-2.5 bg-green-accent/10 text-green-accent border border-green-accent/20 rounded-xl hover:bg-green-accent/20 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <ImageUploader
          value={project.coverImageUrl}
          fileId={project.coverImageFileId}
          label="Cover Image"
          folder="/portfolio/projects/covers"
          onUpload={(url, fileId) => setProject({ ...project, coverImageUrl: url, coverImageFileId: fileId })}
          onDelete={() => setProject({ ...project, coverImageUrl: "", coverImageFileId: "" })}
        />

        {/* Gallery */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-3">Gallery Images</label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {project.gallery.map((item, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-border-subtle group">
                <div className="relative h-24">
                  <Image src={item.url} alt={item.alt || `Gallery ${i}`} fill className="object-cover" />
                </div>
                <button
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <ImageUploader
              label=""
              folder="/portfolio/projects/gallery"
              onUpload={addGalleryImage}
              previewHeight="h-24"
              compact={true}
            />
          </div>
        </div>

        {/* Case Study */}
        <div>
          <label className="block text-sm font-mono text-text-secondary mb-2">Case Study (Rich Text)</label>
          <RichTextEditor value={project.caseStudyRichText} onChange={(html) => setProject({ ...project, caseStudyRichText: html })} />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Project"}
        </button>
      </div>
    </div>
  );
}
