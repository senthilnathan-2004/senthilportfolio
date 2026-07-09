import { getPublicTestimonials } from "@/app/actions/publicActions";
import Testimonials from "@/components/public/Testimonials";

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await getPublicTestimonials().catch(() => []);

  return (
    <div className="flex flex-col min-h-full">
      {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : (
        <div className="min-h-[60vh] flex items-center justify-center font-mono text-text-tertiary">
          No testimonials added yet.
        </div>
      )}
    </div>
  );
}
