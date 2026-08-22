"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Share2Icon,
  LinkIcon,
  CopyIcon,
  CheckIcon,
  PlusIcon,
  Loader2Icon,
  ToggleLeftIcon,
  ToggleRightIcon,
  GlobeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import type { TripDetails } from "@/features/trips/api/trips.api";

interface ShareLink {
  share: {
    id: string;
    tripId: string;
    shareToken: string;
    isActive: boolean;
    allowCopy: boolean;
    expiresAt: string | null;
    createdAt: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="icon-sm" onClick={handleCopy}>
      {copied ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
    </Button>
  );
}

export default function TripSharePage() {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();

  const { data: tripData } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const { data: sharesData, isLoading } = useQuery<ShareLink[]>({
    queryKey: tripKeys.shares(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}/share`),
    enabled: !!tripId,
  });

  const canManage = tripData?.permissions?.canManageMembers ?? false;
  const shares = sharesData ?? [];

  const createShareMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/trips/${tripId}/share`, {
        tripId,
        allowCopy: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.shares(tripId) });
      toast.success("Share link created!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create share link"),
  });

  const toggleShareMutation = useMutation({
    mutationFn: ({ shareId, isActive }: { shareId: string; isActive: boolean }) =>
      apiClient.patch(`/api/trips/${tripId}/share`, { shareId, isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.shares(tripId) });
      toast.success("Share link updated.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update share link"),
  });

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Share Trip</h2>
          <p className="text-xs text-muted-foreground">
            Generate links to share your trip itinerary with others.
          </p>
        </div>
        {canManage && (
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => createShareMutation.mutate()}
            disabled={createShareMutation.isPending}
          >
            {createShareMutation.isPending ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
              <PlusIcon className="size-3.5" />
            )}
            Create Share Link
          </Button>
        )}
      </div>

      {!canManage ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <Share2Icon className="size-10 text-muted-foreground opacity-30" />
            <p className="text-sm font-medium">View-only access</p>
            <p className="text-xs text-muted-foreground">
              Only the trip owner can create share links.
            </p>
          </CardContent>
        </Card>
      ) : shares.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <LinkIcon className="size-10 text-muted-foreground opacity-30" />
            <p className="text-sm font-medium">No share links yet</p>
            <p className="text-xs text-muted-foreground">
              Create a share link to let others view your trip without signing up.
            </p>
            <Button
              size="sm"
              className="mt-2 gap-1.5"
              onClick={() => createShareMutation.mutate()}
              disabled={createShareMutation.isPending}
            >
              {createShareMutation.isPending ? (
                <Loader2Icon className="size-3.5 animate-spin" />
              ) : (
                <PlusIcon className="size-3.5" />
              )}
              Create First Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {shares.map((shareLink) => {
            const shareUrl = `${baseUrl}/shared/${shareLink.share.shareToken}`;
            const isActive = shareLink.share.isActive;
            const isExpired =
              shareLink.share.expiresAt && new Date(shareLink.share.expiresAt) < new Date();

            return (
              <Card key={shareLink.share.id} className={!isActive ? "opacity-60" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <GlobeIcon className="size-4 text-primary" />
                      <CardTitle className="text-sm">Public Share Link</CardTitle>
                      {isExpired ? (
                        <Badge variant="destructive" className="text-[10px] py-0">Expired</Badge>
                      ) : isActive ? (
                        <Badge variant="secondary" className="text-[10px] py-0 text-emerald-600">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] py-0">Disabled</Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1 shrink-0"
                      onClick={() =>
                        toggleShareMutation.mutate({
                          shareId: shareLink.share.id,
                          isActive: !isActive,
                        })
                      }
                      disabled={toggleShareMutation.isPending}
                    >
                      {isActive ? (
                        <>
                          <ToggleRightIcon className="size-4 text-emerald-500" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeftIcon className="size-4 text-muted-foreground" />
                          <span>Disabled</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <CardDescription className="text-[11px]">
                    Created by {shareLink.creator.name} on{" "}
                    {new Date(shareLink.share.createdAt).toLocaleDateString()}
                    {shareLink.share.expiresAt
                      ? ` · Expires ${new Date(shareLink.share.expiresAt).toLocaleDateString()}`
                      : " · No expiration"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={shareUrl}
                      className="font-mono text-xs text-muted-foreground"
                    />
                    <CopyButton text={shareUrl} />
                  </div>
                  {shareLink.share.allowCopy && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      ✓ Viewers can copy this trip to their account
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Share2Icon className="size-3.5 text-primary" />
            How sharing works
          </h3>
          <ul className="space-y-1.5 text-[11px] text-muted-foreground list-disc list-inside">
            <li>Anyone with a share link can view the full trip itinerary and details</li>
            <li>No account required to view a shared trip</li>
            <li>Disable a link at any time to immediately revoke access</li>
            <li>If &quot;Allow Copy&quot; is on, viewers can duplicate the trip to their account</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
