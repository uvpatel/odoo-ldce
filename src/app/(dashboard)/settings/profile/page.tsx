"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserIcon, CameraIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";

interface UserProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    isProfilePublic: boolean;
  };
}

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserProfileResponse>({
    queryKey: userKeys.profile,
    queryFn: () => apiClient.get("/api/users/me"),
  });

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    if (data?.user) {
      setName(data.user.name || "");
      setEmail(data.user.email || "");
    }
  }, [data]);

  const updatePreferencesMutation = useMutation({
    mutationFn: (input: { isProfilePublic?: boolean }) =>
      apiClient.patch("/api/users/me/preferences", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      toast.success("Profile saved successfully!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update profile"),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferencesMutation.mutate({});
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const user = data?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Profile Details</CardTitle>
        <CardDescription>
          Your personal account details, display name, and role permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border">
              {user?.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">Role: {user?.role || "user"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground">Primary login email address</p>
            </div>
          </div>

          <Button type="submit" disabled={updatePreferencesMutation.isPending} className="gap-2">
            {updatePreferencesMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
