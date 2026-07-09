import { getProjectBySlug, getProjects } from "@/app/admin/actions/projectActions";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, GitFork, ArrowLeft, Tag } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  const projects = await getProjects().catch(() => []);
  return projects.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Senthilragu Portfolio`,
    description: project.shortDescription || `Case study for ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const gallery = [...(project.gallery || [])].sort((a: { order: number }, b: { order: number }) => a.order - b.order);

  return (
    <div className="min-h-screen pt-8 md:pt-8 pb-24">
      <div className="max-w-4xl lg:max-w-7xl mx-auto px-4 lg:px-8">
        {/* Back */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-green-accent font-mono text-sm mb-8 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="font-mono text-green-accent text-sm">{project.category}</span>
          <h1 className="text-3xl lg:text-5xl font-display text-text-primary text-justify uppercase mt-2 mb-4">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="text-text-secondary text-lg text-justify leading-relaxed">{project.shortDescription}</p>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3 mb-10">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold text-sm rounded-full transition-all hover:scale-[1.05]">
              <ExternalLink size={14} /> Live Site
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-subtle text-text-primary font-mono text-sm rounded-full hover:border-green-accent/40 transition-all">
              <GitFork size={14} /> GitHub
            </a>
          )}
        </div>

        {/* Cover */}
        {project.coverImageUrl && (
          <div className="relative h-[300px] lg:h-[500px] rounded-4xl overflow-hidden border border-border-subtle mb-10">
            <Image
              src={project.coverImageUrl}
              alt={project.coverImageAlt || project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tech tags */}
        {project.techTags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Tag size={14} className="text-text-tertiary mt-0.5" />
            {project.techTags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs font-mono text-green-accent bg-green-accent/10 border border-green-accent/20 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {gallery.map((item: { url: string; alt: string; fileId: string; order: number }, i: number) => (
              <div key={i} className="relative aspect-video rounded-3xl overflow-hidden border border-border-subtle">
                <Image src={item.url} alt={item.alt || `Screenshot ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Case study */}
        {project.caseStudyRichText && (
          <div className="bg-bg-card border border-border-subtle rounded-4xl py-8 px-5 sm:px-8 lg:py-10 lg:px-8">
            <h2 className="font-display text-xl uppercase text-text-primary mb-6">Case Study</h2>
            <div
              className="tiptap-content text-justify"
              dangerouslySetInnerHTML={{ __html: project.caseStudyRichText }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
