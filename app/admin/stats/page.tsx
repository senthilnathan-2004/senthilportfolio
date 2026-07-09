"use client";

import { useState, useEffect } from "react";
import { getStats, createStat, updateStat, deleteStat } from "@/app/admin/actions/skillStatActions";
import { Plus, Trash2, Loader2, Save, CheckCircle } from "lucide-react";

interface Stat { _id: string; number: string; label: string; order: number; }

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    getStats().then((data) => { setStats(data || []); setLoading(false); });
  }, []);

  const showSaved = (key: string) => { setSaved(key); setTimeout(() => setSaved(null), 2000); };

  const handleAdd = async () => {
    const stat = await createStat({ number: "0+", label: "New Stat", order: stats.length });
    setStats([...stats, stat]);
  };

  const handleUpdate = (id: string, field: keyof Stat, value: string) => {
    setStats(stats.map(s => s._id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async (stat: Stat) => {
    setSaving(stat._id);
    await updateStat(stat._id, { number: stat.number, label: stat.label });
    setSaving(null);
    showSaved(stat._id);
  };

  const handleDelete = async (id: string) => {
    await deleteStat(id);
    setStats(stats.filter(s => s._id !== id));
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
          <span className="font-mono text-green-accent text-sm">// stats</span>
          <h1 className="text-2xl font-display text-text-primary mt-1">Success & Achievements</h1>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-green-accent/10 text-green-accent border border-green-accent/30 rounded-full font-mono text-sm hover:bg-green-accent/20 transition-colors">
          <Plus size={14} /> Add Stat
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat._id} className="flex items-center gap-3 p-4 bg-bg-card border border-border-subtle rounded-2xl">
            <div className="flex-1 space-y-2">
              <input
                value={stat.number}
                onChange={(e) => handleUpdate(stat._id, "number", e.target.value)}
                placeholder="97"
                className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-green-accent font-display text-2xl focus:border-green-accent focus:outline-none"
              />
              <input
                value={stat.label}
                onChange={(e) => handleUpdate(stat._id, "label", e.target.value)}
                placeholder="Completed Projects"
                className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-secondary font-mono text-sm focus:border-green-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleSave(stat)} disabled={saving === stat._id} className="p-2 bg-green-accent/10 text-green-accent rounded-xl hover:bg-green-accent/20 transition-colors">
                {saving === stat._id ? <Loader2 size={14} className="animate-spin" /> : saved === stat._id ? <CheckCircle size={14} /> : <Save size={14} />}
              </button>
              <button onClick={() => handleDelete(stat._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
