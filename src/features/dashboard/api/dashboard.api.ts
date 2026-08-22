export async function fetchDashboardData() {
  const res = await fetch("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}
