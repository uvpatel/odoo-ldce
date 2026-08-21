import { requirePermission } from "@/lib/auth/session";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth-schema";
import { UserManagementTable } from "./user-management-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";

export default async function UserManagementPage() {
  const { user: currentUser } = await requirePermission("user.role.manage");

  const rawUsers = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      image: userTable.image,
      role: userTable.role,
      status: userTable.status,
      createdAt: userTable.createdAt,
    })
    .from(userTable);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheckIcon className="size-6 text-primary" />
          User & Role Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage system users, assign role-based permissions, and control access statuses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Accounts</CardTitle>
          <CardDescription>
            View all registered users and assign hierarchical permissions. Super Admin permissions are restricted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable
            users={rawUsers}
            currentUserId={currentUser.id}
            currentUserRole={currentUser.role}
          />
        </CardContent>
      </Card>
    </div>
  );
}
