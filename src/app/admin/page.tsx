import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();

  return <AdminDashboard initialContent={content} />;
}
