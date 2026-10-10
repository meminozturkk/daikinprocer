import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
import { products } from "@/content/products";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();
  const catalogProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    series: p.series,
    modelCode: p.modelCode,
    defaultImage: p.image,
  }));

  return <AdminDashboard initialContent={content} catalogProducts={catalogProducts} />;
}
