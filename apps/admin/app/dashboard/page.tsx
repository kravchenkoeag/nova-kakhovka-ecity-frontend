// apps/admin/app/dashboard/page.tsx
// Redirect /dashboard to / (root dashboard)

import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  redirect("/");
}

