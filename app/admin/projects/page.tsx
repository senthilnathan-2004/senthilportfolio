"use client";

import { useState, useEffect } from "react";
import { getProjects, createProject, deleteProject } from "@/app/admin/actions/projectActions";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Pencil, Loader2, Star, ExternalLink, GitFork } from "lucide-react";

interface Project {
  _id: string; title: string; slug: string; coverImageUrl: string;
  shortDescription: string; category: string; featured: boolean;
  techTags: string[]; liveUrl: string; githubUrl: string; order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getProjects().then((data) => { setProjects(data || []); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    const project = await createProject({ title: "New Project", category: "Web Development" });
    setProjects([...projects, project]);
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(id);
    setProjects(projects.filter(p => p._id !== id));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="font-mono text-green-accent text-sm">// projects</span>
          <h1 className="text-2xl font-display text-text-primary mt-1">Portfolio Projects</h1>
          <p className="text-sm font-mono text-text-secondary mt-1">{projects.length} projects total</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-60"
        >
          {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-text-tertiary font-mono">
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project._id} className="flex items-center gap-4 p-4 bg-bg-card border border-border-subtle rounded-2xl group hover:border-green-accent/20 transition-all">
              {/* Cover */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-primary border border-border-subtle shrink-0">
                {project.coverImageUrl ? (
                  <Image src={project.coverImageUrl} alt={project.title} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-tertiary font-mono text-xs">IMG</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-text-primary font-semibold truncate">{project.title}</p>
                  {project.featured && <Star size={12} className="text-green-accent fill-green-accent shrink-0" />}
                </div>
                <p className="text-xs text-text-tertiary font-mono">{project.category}</p>
                {project.techTags?.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {project.techTags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs font-mono text-text-tertiary bg-bg-primary px-1.5 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" className="p-2 text-text-tertiary hover:text-green-accent transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" className="p-2 text-text-tertiary hover:text-green-accent transition-colors">
                    <GitFork size={14} />
                  </a>
                )}
                <Link
                  href={`/admin/projects/${project._id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-accent/10 text-green-accent border border-green-accent/20 rounded-full font-mono text-xs hover:bg-green-accent/20 transition-colors"
                >
                  <Pencil size={11} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
