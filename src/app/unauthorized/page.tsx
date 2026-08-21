import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlertIcon } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlertIcon className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this resource or your account status does not allow access.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          If you believe this is a mistake, please contact your workspace administrator to request elevated permissions.
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-2">
          <Button  variant="default">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button variant="outline">
            <Link href="/signin">Sign In Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
