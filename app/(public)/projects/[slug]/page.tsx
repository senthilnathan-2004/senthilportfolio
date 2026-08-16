import { getProjectBySlug, getProjects } from "@/app/admin/actions/projectActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, GitFork, ArrowLeft, Tag } from "lucide-react";
import type { Metadata } from "next";
import ProjectGallerySlider, { GallerySlide } from "@/components/public/ProjectGallerySlider";

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
    title: `${project.title} | Senthilragu Portfolio`,
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

  // Combine cover image and gallery screenshots into slides
  const slides: GallerySlide[] = [];
  if (project.coverImageUrl) {
    slides.push({
      url: project.coverImageUrl,
      alt: project.coverImageAlt || `${project.title} Cover`,
    });
  }

  const sortedGallery = [...(project.gallery || [])].sort(
    (a: { order: number }, b: { order: number }) => a.order - b.order
  );

  sortedGallery.forEach((item) => {
    if (item.url && item.url !== project.coverImageUrl) {
      slides.push({
        url: item.url,
        alt: item.alt || `${project.title} Screenshot`,
        fileId: item.fileId,
        order: item.order,
      });
    }
  });

  return (
    <div className="pt-6 md:pt-8 pb-4 sm:pb-8">
      <div className="max-w-6xl mx-auto px-2 md:px-6 lg:px-8">
        {/* Back */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-text-secondary hover:text-green-accent font-mono text-sm mb-8 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-6 sm:mb-8 px-1 md:px-0 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-green-accent text-xs sm:text-sm px-3 py-1 rounded-full bg-green-accent/10 border border-green-accent/20">
              {project.category}
            </span>
            {project.featured && (
              <span className="font-mono text-xs text-bg-primary bg-green-accent font-bold px-2.5 py-0.5 rounded-full">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-text-primary text-left leading-tight mt-1 mb-3 w-full">
            {project.title}
          </h1>
          {project.shortDescription && (
            <div className="bg-bg-card/40 border border-border-subtle/30 rounded-xl p-3.5 sm:p-4 md:bg-transparent md:border-none md:p-0 md:rounded-none mt-2 mb-4 sm:mb-6 w-full">
              <div className="prose prose-invert w-full max-w-none text-justify prose-p:text-text-primary prose-p:text-base sm:prose-p:text-lg prose-p:font-semibold prose-p:leading-relaxed prose-p:mb-0 prose-p:text-justify max-w-none">
                <p className="text-justify font-sans text-text-primary text-base sm:text-lg font-semibold leading-relaxed w-full max-w-none">
                  {project.shortDescription}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Links & Tech Tags Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 px-1 md:px-0 w-full">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-green-accent hover:bg-green-hover text-bg-primary font-mono font-bold text-xs sm:text-sm rounded-full transition-all hover:scale-[1.05] shadow-lg shadow-green-accent/10">
                <ExternalLink size={13} /> Live Site
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-bg-card border border-border-subtle text-text-primary font-mono text-xs sm:text-sm rounded-full hover:border-green-accent/40 transition-all">
                <GitFork size={13} /> GitHub
              </a>
            )}
          </div>

          {project.techTags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag size={12} className="text-text-tertiary mr-0.5" />
              {project.techTags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-mono text-green-accent bg-green-accent/5 border border-green-accent/20 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Slideshow */}
        {slides.length > 0 && (
          <ProjectGallerySlider
            slides={slides}
            projectTitle={project.title}
            category={project.category}
          />
        )}

        {/* Case study */}
        {project.caseStudyRichText && (
          <div className="w-full bg-bg-card border border-border-subtle rounded-2xl sm:rounded-3xl lg:rounded-4xl p-4 sm:p-8 lg:p-14 shadow-xl">
            <div className="w-full mb-5 pb-3 sm:pb-4 border-b border-border-subtle">
              <h2 className="font-mono font-bold text-base sm:text-xl lg:text-2xl text-text-primary tracking-wide w-full">
                Case Study & Technical Highlights
              </h2>
            </div>
            <div className="bg-bg-card/40 border border-border-subtle/30 rounded-xl p-3.5 sm:p-4 md:bg-transparent md:border-none md:p-0 md:rounded-none w-full">
              <div className="prose prose-invert w-full max-w-none font-sans text-justify prose-p:text-text-primary prose-p:text-base sm:prose-p:text-lg prose-p:font-semibold prose-p:leading-relaxed prose-p:mb-2 md:prose-p:mb-4 prose-p:text-justify prose-a:text-green-accent hover:prose-a:underline transition-colors">
                <div
                  className="tiptap-content w-full text-justify font-sans"
                  dangerouslySetInnerHTML={{ __html: project.caseStudyRichText }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

