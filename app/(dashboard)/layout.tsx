import { AuthGuard } from "@/components/AuthGuard";
import { DashboardLayoutClient } from "@/components/DashboardLayoutClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </AuthGuard>
  );
}
