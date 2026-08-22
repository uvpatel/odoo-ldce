"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface PreferencesData {
  language: string;
  currency: string;
  timezone: string;
  isProfilePublic: boolean;
}

export default function PrivacySettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<PreferencesData>({
    queryKey: userKeys.preferences,
    queryFn: () => apiClient.get("/api/users/me/preferences"),
  });
  const [profileVisibility, setProfileVisibility] = React.useState<boolean | null>(null);
  const isProfilePublic = profileVisibility ?? data?.isProfilePublic ?? false;

  const updateMutation = useMutation({
    mutationFn: () =>
      apiClient.patch<PreferencesData>("/api/users/me/preferences", {
        isProfilePublic,
      }),
    onSuccess: (preferences) => {
      queryClient.setQueryData(userKeys.preferences, preferences);
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      setProfileVisibility(null);
      toast.success("Privacy setting saved.");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to save privacy setting"),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent><Skeleton className="h-28 w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldCheckIcon className="size-5 text-primary" />
          Privacy & Visibility
        </CardTitle>
        <CardDescription>
          Control whether your traveler profile can accompany trips you publish to the community.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-xl space-y-6">
        <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
          <Checkbox
            id="profileExplore"
            checked={isProfilePublic}
            onCheckedChange={(checked) => setProfileVisibility(Boolean(checked))}
          />
          <div className="space-y-1 leading-none">
            <label htmlFor="profileExplore" className="cursor-pointer text-sm font-semibold">
              Show my traveler profile with public trips
            </label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your display name and avatar may appear beside itineraries you deliberately publish. Your email address is never shown.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-xs text-muted-foreground">
          Trip visibility remains under your control per itinerary. Manage public links, copying, and expiration from each trip&apos;s
          {" "}<Link href="/trips" className="font-semibold text-primary underline-offset-4 hover:underline">sharing settings</Link>.
        </div>

        <Button
          type="button"
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending || profileVisibility === null}
          className="gap-2"
        >
          {updateMutation.isPending ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
          Save Privacy Setting
        </Button>
      </CardContent>
    </Card>
  );
}
