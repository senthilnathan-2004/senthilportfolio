"use client";

import { useState, useEffect } from "react";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/app/admin/actions/contentActions";
import { getServices, createService, updateService, deleteService } from "@/app/admin/actions/contentActions";
import ImageUploader from "@/components/admin/ImageUploader";
import { Plus, Trash2, Loader2, Save, CheckCircle, Star } from "lucide-react";

interface Testimonial { _id: string; name: string; role: string; company: string; avatarUrl: string; avatarFileId: string; quote: string; rating: number; isApproved: boolean; }
interface Service { _id: string; icon: string; title: string; description: string; }

const ICONS = ["Code2", "Globe", "Smartphone", "Database", "Brush", "Zap", "Shield", "BarChart3", "Rocket"];

export default function AdminContentPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getTestimonials(), getServices()]).then(([t, s]) => {
      setTestimonials(t || []);
      setServices(s || []);
      setLoading(false);
    });
  }, []);

  const showSaved = (key: string) => { setSaved(key); setTimeout(() => setSaved(null), 2000); };

  // Testimonials
  const addTestimonial = async () => {
    const t = await createTestimonial({ name: "Client Name", quote: "Excellent work!" });
    setTestimonials([...testimonials, t]);
  };

  const saveTestimonial = async (t: Testimonial) => {
    setSaving(t._id);
    await updateTestimonial(t._id, { name: t.name, role: t.role, company: t.company, avatarUrl: t.avatarUrl, avatarFileId: t.avatarFileId, quote: t.quote, rating: t.rating, isApproved: t.isApproved });
    setSaving(null);
    showSaved(t._id);
  };

  const updateT = (id: string, field: keyof Testimonial, value: string | number | boolean) => {
    setTestimonials(prev => prev.map(t => t._id === id ? { ...t, [field]: value } : t));
  };

  // Services
  const addService = async () => {
    const s = await createService({ icon: "Code2", title: "New Service", description: "" });
    setServices([...services, s]);
  };

  const saveService = async (s: Service) => {
    setSaving("svc-" + s._id);
    await updateService(s._id, { icon: s.icon, title: s.title, description: s.description });
    setSaving(null);
    showSaved("svc-" + s._id);
  };

  const updateS = (id: string, field: keyof Service, value: string) => {
    setServices(prev => prev.map(s => s._id === id ? { ...s, [field]: value } : s));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <Loader2 className="text-green-accent animate-spin" size={32} />
    </div>
  );

  const inputClass = "w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-primary font-mono text-sm focus:border-green-accent focus:outline-none";

  return (
    <div className="p-8 w-full space-y-12">
      {/* Testimonials */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-green-accent text-sm">// testimonials</span>
            <h1 className="text-2xl font-display text-text-primary mt-1">Testimonials</h1>
          </div>
          <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 bg-green-accent/10 text-green-accent border border-green-accent/30 rounded-full font-mono text-sm hover:bg-green-accent/20 transition-colors">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t._id} className={`p-5 bg-bg-card border ${t.isApproved ? "border-border-subtle" : "border-red-500/50"} rounded-3xl space-y-3`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-mono px-2 py-1 rounded-md ${t.isApproved ? "bg-green-accent/10 text-green-accent" : "bg-red-500/10 text-red-500"}`}>
                  {t.isApproved ? "APPROVED" : "PENDING APPROVAL"}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-mono text-text-secondary">Show Publicly</span>
                  <input type="checkbox" checked={t.isApproved || false} onChange={(e) => updateT(t._id, "isApproved", e.target.checked)} className="accent-green-accent w-4 h-4" />
                </label>
              </div>
              <div className="flex gap-4">
                <div className="w-16 shrink-0">
                  <ImageUploader value={t.avatarUrl} fileId={t.avatarFileId} label="" folder="/portfolio/avatars"
                  onUpload={(url, fid) => { updateT(t._id, "avatarUrl", url); updateT(t._id, "avatarFileId", fid); }}
                    onDelete={() => updateT(t._id, "avatarUrl", "")}
                    className="h-16" previewHeight="h-16" compact={true} />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input value={t.name} onChange={(e) => updateT(t._id, "name", e.target.value)} placeholder="Name" className={inputClass} />
                  <input value={t.role} onChange={(e) => updateT(t._id, "role", e.target.value)} placeholder="Role" className={inputClass} />
                  <input value={t.company} onChange={(e) => updateT(t._id, "company", e.target.value)} placeholder="Company" className={inputClass} />
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => updateT(t._id, "rating", s)} className="p-1">
                        <Star size={14} className={s <= t.rating ? "text-green-accent fill-green-accent" : "text-text-tertiary"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea value={t.quote} onChange={(e) => updateT(t._id, "quote", e.target.value)} placeholder="Quote..." rows={3} className={`${inputClass} resize-none`} />
              <div className="flex justify-between">
                <button onClick={() => { deleteTestimonial(t._id); setTestimonials(testimonials.filter(x => x._id !== t._id)); }} className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"><Trash2 size={12} /> Delete</button>
                <button onClick={() => saveTestimonial(t)} disabled={saving === t._id} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-accent/10 text-green-accent border border-green-accent/20 rounded-full font-mono text-xs hover:bg-green-accent/20 transition-colors">
                  {saving === t._id ? <Loader2 size={12} className="animate-spin" /> : saved === t._id ? <CheckCircle size={12} /> : <Save size={12} />}
                  {saving === t._id ? "Saving" : saved === t._id ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-green-accent text-sm">// services</span>
            <h2 className="text-2xl font-display text-text-primary mt-1">Services / What I Offer</h2>
          </div>
          <button onClick={addService} className="flex items-center gap-2 px-4 py-2 bg-green-accent/10 text-green-accent border border-green-accent/30 rounded-full font-mono text-sm hover:bg-green-accent/20 transition-colors">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s._id} className="p-4 bg-bg-card border border-border-subtle rounded-2xl flex items-start gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <select value={s.icon} onChange={(e) => updateS(s._id, "icon", e.target.value)} className="px-2 py-2 bg-bg-primary border border-border-subtle rounded-xl text-text-primary font-mono text-xs focus:border-green-accent focus:outline-none">
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <input value={s.title} onChange={(e) => updateS(s._id, "title", e.target.value)} placeholder="Service title" className={`flex-1 ${inputClass}`} />
                </div>
                <textarea value={s.description} onChange={(e) => updateS(s._id, "description", e.target.value)} placeholder="Description..." rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => saveService(s)} disabled={saving === "svc-" + s._id} className="p-2 bg-green-accent/10 text-green-accent rounded-xl hover:bg-green-accent/20 transition-colors">
                  {saving === "svc-" + s._id ? <Loader2 size={13} className="animate-spin" /> : saved === "svc-" + s._id ? <CheckCircle size={13} /> : <Save size={13} />}
                </button>
                <button onClick={() => { deleteService(s._id); setServices(services.filter(x => x._id !== s._id)); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
