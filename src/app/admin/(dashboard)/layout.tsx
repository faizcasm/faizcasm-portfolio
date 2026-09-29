import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdminNav />
      {children}
    </div>
  );
}
