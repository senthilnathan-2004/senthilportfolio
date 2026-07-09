import { getServices } from "@/app/admin/actions/contentActions";
import Services from "@/components/public/Services";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices().catch(() => []);

  return (
    <div className="flex flex-col min-h-full">
      {services.length > 0 ? <Services services={services} /> : (
        <div className="min-h-[60vh] flex items-center justify-center font-mono text-text-tertiary">
          No services added yet.
        </div>
      )}
    </div>
  );
}
