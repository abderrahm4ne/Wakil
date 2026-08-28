import type { Metadata } from "next";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { auth } from "@/auth";
import { PlanProvider } from "@/providers/plan-provider";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Wakil",
  description: "Wakil - Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? 'fr'
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  
  const plan = session.user.plan

  return (
    <PlanProvider plan={plan}>
      <div
        dir={direction}
        className="min-h-screen bg-background"
      >
        <DashboardSidebar />

        <div className="flex flex-col">
          <DashboardNavbar />

          <main
            className={`flex-1 sm:p-10 ${
              direction === "rtl"
                ? "sm:pr-30 pr-30"
                : "sm:pl-30 pl-30"
            } p-5`}
          >
            {children}
          </main>
        </div>
      </div>
    </PlanProvider>
  )
}