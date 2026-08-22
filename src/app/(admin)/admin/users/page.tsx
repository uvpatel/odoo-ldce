"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersIcon, ShieldIcon, SearchIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { adminKeys } from "@/lib/query-keys";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery<{
    items: AdminUser[];
    total: number;
  }>({
    queryKey: adminKeys.users({ search: debouncedSearch }),
    queryFn: () => apiClient.get("/api/admin/users", { search: debouncedSearch || undefined, limit: 50 }),
  });

  const users = data?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <UsersIcon className="size-7 text-primary" />
            User & Role Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Audit registered accounts, role privileges, and system permissions.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Registered Accounts ({data?.total ?? 0})</CardTitle>
          <CardDescription className="text-xs">Database records of all registered travelers</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground p-8 text-center">No users found.</p>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {u.name ? u.name.slice(0, 2).toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{u.name}</span>
                      <Badge variant={u.role.includes("admin") ? "default" : "secondary"} className="text-[10px] uppercase font-mono py-0">
                        {u.role.replace("_", " ")}
                      </Badge>
                      <Badge variant={u.status === "active" ? "outline" : "destructive"} className="text-[10px] py-0">
                        {u.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {u.email} · Joined {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
