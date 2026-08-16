"use client";

import { useState, useEffect } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
  reorderProjects,
} from "@/app/admin/actions/projectActions";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Star,
  ExternalLink,
  GitFork,
  GripVertical,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

interface Project {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  shortDescription: string;
  category: string;
  featured: boolean;
  techTags: string[];
  liveUrl: string;
  githubUrl: string;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  const showSavedNotification = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleCreate = async () => {
    setCreating(true);
    const project = await createProject({
      title: "New Project",
      category: "Web Development",
    });
    setProjects((prev) => [...prev, project]);
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  // Reorder logic and persist to database
  const saveNewOrder = async (updatedList: Project[]) => {
    setSavingOrder(true);
    try {
      await reorderProjects(updatedList.map((p) => p._id));
      showSavedNotification();
    } catch (err) {
      console.error("Failed to reorder projects:", err);
    } finally {
      setSavingOrder(false);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Set transparent image or drag data for smooth dragging
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...projects];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setProjects(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);

    await saveNewOrder(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Quick Move Up/Down button handlers
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);

    setProjects(updated);
    await saveNewOrder(updated);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="text-green-accent animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-green-accent text-sm">// projects</span>
            {savingOrder && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-accent/10 text-green-accent font-mono text-xs animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Saving order...
              </span>
            )}
            {savedToast && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-accent/10 border border-green-accent/30 text-green-accent font-mono text-xs animate-in fade-in">
                <CheckCircle2 size={12} /> Order updated live!
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display text-text-primary mt-1">
            Portfolio Projects
          </h1>
          <p className="text-xs sm:text-sm font-mono text-text-secondary mt-1">
            {projects.length} projects total • <strong className="text-green-accent font-normal">Drag & drop rows</strong> to rearrange their display order on the public site.
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 shadow-lg shadow-green-accent/10 shrink-0"
        >
          {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-bg-card border border-dashed border-border-subtle rounded-3xl text-text-tertiary font-mono">
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => {
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <div
                key={project._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-bg-card border rounded-2xl transition-all select-none ${
                  isDragging
                    ? "opacity-40 border-dashed border-green-accent scale-[0.99] bg-green-accent/5"
                    : isOver
                    ? "border-green-accent ring-2 ring-green-accent/20 bg-green-accent/5 -translate-y-1"
                    : "border-border-subtle hover:border-green-accent/40"
                }`}
              >
                {/* Drag Handle & Position Indicator */}
                <div className="flex items-center gap-1 shrink-0">
                  <div
                    className="p-1.5 text-text-tertiary hover:text-green-accent cursor-grab active:cursor-grabbing rounded-lg hover:bg-bg-primary transition-colors"
                    title="Drag to reorder"
                  >
                    <GripVertical size={18} />
                  </div>

                  <span className="hidden sm:inline-block font-mono text-xs text-text-tertiary w-5 text-center">
                    {index + 1}
                  </span>

                  {/* Up / Down Move Buttons for accessibility and mobile */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-0.5 text-text-tertiary hover:text-green-accent disabled:opacity-20 disabled:hover:text-text-tertiary transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === projects.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-0.5 text-text-tertiary hover:text-green-accent disabled:opacity-20 disabled:hover:text-text-tertiary transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                </div>

                {/* Cover Thumbnail */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-bg-primary border border-border-subtle shrink-0 relative">
                  {project.coverImageUrl ? (
                    <Image
                      src={project.coverImageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-tertiary font-mono text-[10px]">
                      IMG
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-text-primary font-semibold text-sm sm:text-base truncate">
                      {project.title}
                    </p>
                    {project.featured && (
                      <span title="Featured on Homepage" className="shrink-0 flex items-center">
                        <Star
                          size={12}
                          className="text-green-accent fill-green-accent"
                        />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary font-mono">{project.category}</p>
                  {project.techTags?.length > 0 && (
                    <div className="hidden sm:flex gap-1 mt-1.5 flex-wrap">
                      {project.techTags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono text-text-tertiary bg-bg-primary px-1.5 py-0.5 rounded-md border border-border-subtle/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-text-tertiary hover:text-green-accent transition-colors"
                      title="View Live Site"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-text-tertiary hover:text-green-accent transition-colors"
                      title="View GitHub Repository"
                    >
                      <GitFork size={14} />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${project._id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-accent/10 text-green-accent border border-green-accent/20 rounded-xl font-mono text-xs hover:bg-green-accent/20 transition-colors"
                  >
                    <Pencil size={11} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
