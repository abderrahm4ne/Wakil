import type { Metadata } from "next";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { auth } from "@/auth";
import { PlanProvider } from "@/providers/plan-provider";
import { redirect } from "next/navigation";

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

  const plan = session.user.plan || "FREE_TRIAL";

  return (
    <PlanProvider plan={plan}>
      <div className="min-h-screen bg-background">
          <DashboardSidebar />
          <div className="flex flex-col">
              <DashboardNavbar />
              <main className="ml-64 flex-1 p-8">{children}</main>
          </div>
      </div>
    </PlanProvider>
  );
}
