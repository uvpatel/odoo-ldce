"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CameraIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
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
  const { data, isLoading } = useQuery<UserProfileResponse>({
    queryKey: userKeys.profile,
    queryFn: () => apiClient.get("/api/users/me"),
  });

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

  if (!data?.user) {
    return <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Unable to load your profile.</CardContent></Card>;
  }

  return <ProfileForm key={`${data.user.name}-${data.user.email}-${data.user.image ?? ""}`} user={data.user} />;
}

function ProfileForm({ user }: { user: UserProfileResponse["user"] }) {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState(user.name || "");
  const [email, setEmail] = React.useState(user.email || "");
  const [image, setImage] = React.useState(user.image || "");

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const { data: updatedUser, error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (error) throw new Error(error.message || "Failed to update profile");

      const normalizedEmail = email.trim().toLowerCase();
      const emailChanged = normalizedEmail !== user.email.toLowerCase();
      if (emailChanged) {
        const { error: emailError } = await authClient.changeEmail({
          newEmail: normalizedEmail,
          callbackURL: `${window.location.origin}/settings/profile`,
        });
        if (emailError) throw new Error(emailError.message || "Failed to request email change");
      }

      return { updatedUser, emailChanged };
    },
    onSuccess: ({ emailChanged }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      toast.success(
        emailChanged
          ? "Profile saved. Check your new inbox to confirm the email change."
          : "Profile saved successfully!"
      );
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update profile"),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Enter your name before saving.");
      return;
    }
    if (!email.trim()) {
      toast.error("Enter a valid email address before saving.");
      return;
    }
    updateProfileMutation.mutate();
  };

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
              {image ? (
                <AvatarImage src={image} alt={name || user.name || "Profile"} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">Role: {user.role || "user"}</p>
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
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Changes are applied after you confirm the verification email.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profileImage" className="flex items-center gap-2">
              <CameraIcon className="size-4 text-primary" /> Profile photo URL
            </Label>
            <Input
              id="profileImage"
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/your-photo.jpg"
            />
            <p className="text-[11px] text-muted-foreground">Paste a secure image URL. Leave blank to use your initials.</p>
          </div>

          <Button type="submit" disabled={updateProfileMutation.isPending} className="gap-2">
            {updateProfileMutation.isPending ? (
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
