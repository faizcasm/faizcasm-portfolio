import { redirect } from "next/navigation";
import { isAuthenticated, adminConfigured } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Blog admin
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sign in to create and manage posts.
        </p>
        {!adminConfigured() && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
            ADMIN_USERNAME / ADMIN_PASSWORD are not set in this environment, so
            signing in will fail. Add them to <code>.env.local</code> (locally)
            or your Vercel project settings.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
