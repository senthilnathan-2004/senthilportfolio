"use client";

import { useState, useEffect } from "react";
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/app/admin/actions/skillStatActions";
import { getStats, createStat, updateStat, deleteStat } from "@/app/admin/actions/skillStatActions";
import { Plus, Trash2, Loader2, Save, CheckCircle } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface Skill { _id: string; name: string; iconUrl: string; iconFileId: string; level: number; order: number; category: string; }
interface Stat { _id: string; number: string; label: string; order: number; }

export default function AdminSkillsStatsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSkills(), getStats()]).then(([s, st]) => {
      setSkills(s || []);
      setStats(st || []);
      setLoading(false);
    });
  }, []);

  const showSaved = (key: string) => { setSaved(key); setTimeout(() => setSaved(null), 2000); };

  // Skills
  const handleAddSkill = async (categoryName: string = "Frontend") => {
    const skill = await createSkill({ name: "New Skill", category: categoryName, level: 80, order: skills.length });
    setSkills([...skills, skill]);
  };

  const handleAddCategory = () => {
    const name = window.prompt("Enter new category name:");
    if (name && name.trim() !== "") {
      handleAddSkill(name.trim());
    }
  };

  const categories = Array.from(new Set(skills.map(s => s.category || "Uncategorized")));

  const handleUpdateSkill = async (id: string, field: keyof Skill, value: string | number) => {
    setSkills(skills.map(s => s._id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveSkill = async (skill: Skill) => {
    setSaving(skill._id);
    await updateSkill(skill._id, { name: skill.name, iconUrl: skill.iconUrl, iconFileId: skill.iconFileId, level: skill.level, category: skill.category });
    setSaving(null);
    showSaved(skill._id);
  };

  const handleDeleteSkill = async (id: string) => {
    await deleteSkill(id);
    setSkills(skills.filter(s => s._id !== id));
  };

  const handleSkillIcon = (id: string, url: string, fileId: string) => {
    setSkills(skills.map(s => s._id === id ? { ...s, iconUrl: url, iconFileId: fileId } : s));
  };

  // Stats
  const handleAddStat = async () => {
    const stat = await createStat({ number: "0+", label: "New Stat", order: stats.length });
    setStats([...stats, stat]);
  };

  const handleUpdateStat = (id: string, field: keyof Stat, value: string) => {
    setStats(stats.map(s => s._id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveStat = async (stat: Stat) => {
    setSaving("stat-" + stat._id);
    await updateStat(stat._id, { number: stat.number, label: stat.label });
    setSaving(null);
    showSaved("stat-" + stat._id);
  };

  const handleDeleteStat = async (id: string) => {
    await deleteStat(id);
    setStats(stats.filter(s => s._id !== id));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  return (
    <div className="p-8 w-full space-y-10">
      {/* Skills */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-green-accent text-sm">// skills</span>
            <h1 className="text-2xl font-display text-text-primary mt-1">Tech Stack / Skills</h1>
          </div>
          <button onClick={handleAddCategory} className="flex items-center gap-2 px-4 py-2 bg-green-accent/10 text-green-accent border border-green-accent/30 rounded-full font-mono text-sm hover:bg-green-accent/20 transition-colors">
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div className="space-y-10">
          {categories.map(category => (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <h2 className="text-xl font-display text-text-primary">{category}</h2>
                <button onClick={() => handleAddSkill(category)} className="flex items-center gap-2 text-xs font-mono text-green-accent hover:text-green-accent/80 transition-colors">
                  <Plus size={12} /> Add Skill to {category}
                </button>
              </div>
              <div className="space-y-3">
                {skills.filter(s => (s.category || "Uncategorized") === category).map((skill) => (
                  <div key={skill._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-bg-card border border-border-subtle rounded-2xl">
                    {/* Icon */}
                    <div className="w-16 h-16 shrink-0">
                      <ImageUploader
                        value={skill.iconUrl}
                        fileId={skill.iconFileId}
                        label=""
                        folder="/portfolio/skills"
                        onUpload={(url, fileId) => handleSkillIcon(skill._id, url, fileId)}
                        onDelete={() => handleSkillIcon(skill._id, "", "")}
                        className="h-16"
                        previewHeight="h-16"
                        compact={true}
                      />
                    </div>
                    {/* Fields */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={skill.name}
                          onChange={(e) => handleUpdateSkill(skill._id, "name", e.target.value)}
                          placeholder="Skill name"
                          className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none"
                        />
                        <input
                          value={skill.category || ""}
                          onChange={(e) => handleUpdateSkill(skill._id, "category", e.target.value)}
                          placeholder="Category (e.g. Frontend)"
                          className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none"
                        />
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveSkill(skill)}
                        disabled={saving === skill._id}
                        className="p-2 bg-green-accent/10 text-green-accent rounded-xl hover:bg-green-accent/20 transition-colors"
                      >
                        {saving === skill._id ? <Loader2 size={14} className="animate-spin" /> : saved === skill._id ? <CheckCircle size={14} /> : <Save size={14} />}
                      </button>
                      <button onClick={() => handleDeleteSkill(skill._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono text-green-accent text-sm">// stats</span>
            <h1 className="text-2xl font-display text-text-primary mt-1">Success & Achievements</h1>
          </div>
          <button onClick={handleAddStat} className="flex items-center gap-2 px-4 py-2 bg-green-accent/10 text-green-accent border border-green-accent/30 rounded-full font-mono text-sm hover:bg-green-accent/20 transition-colors">
            <Plus size={14} /> Add Stat
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat._id} className="flex items-center gap-3 p-4 bg-bg-card border border-border-subtle rounded-2xl">
              <div className="flex-1 space-y-2">
                <input
                  value={stat.number}
                  onChange={(e) => handleUpdateStat(stat._id, "number", e.target.value)}
                  placeholder="97"
                  className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-green-accent font-display text-2xl focus:border-green-accent focus:outline-none"
                />
                <input
                  value={stat.label}
                  onChange={(e) => handleUpdateStat(stat._id, "label", e.target.value)}
                  placeholder="Completed Projects"
                  className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-secondary font-mono text-sm focus:border-green-accent focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSaveStat(stat)}
                  disabled={saving === "stat-" + stat._id}
                  className="p-2 bg-green-accent/10 text-green-accent rounded-xl hover:bg-green-accent/20 transition-colors"
                >
                  {saving === "stat-" + stat._id ? <Loader2 size={14} className="animate-spin" /> : saved === "stat-" + stat._id ? <CheckCircle size={14} /> : <Save size={14} />}
                </button>
                <button onClick={() => handleDeleteStat(stat._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
