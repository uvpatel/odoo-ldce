"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UsersIcon,
  UserPlusIcon,
  MailIcon,
  Trash2Icon,
  CrownIcon,
  Loader2Icon,
  ShieldCheckIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import type { TripDetails, TripMember } from "@/features/trips/api/trips.api";

const ROLE_CONFIG = {
  owner: { label: "Owner", icon: CrownIcon, variant: "default" as const },
  editor: { label: "Editor", icon: ShieldCheckIcon, variant: "secondary" as const },
  viewer: { label: "Viewer", icon: EyeIcon, variant: "outline" as const },
};

function MemberAvatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="size-9 rounded-full object-cover border"
      />
    );
  }
  return (
    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function TripMembersPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<"editor" | "viewer">("editor");

  const { data, isLoading } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const members = data?.members ?? [];
  const canManageMembers = data?.permissions?.canManageMembers ?? false;

  const addMemberMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      apiClient.post(`/api/trips/${tripId}/members`, { email, role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.members(tripId) });
      toast.success(`Invitation sent to ${variables.email}!`);
      setInviteEmail("");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to invite member"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (membershipId: string) =>
      apiClient.delete(`/api/trips/${tripId}/members/${membershipId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.members(tripId) });
      toast.info("Member removed from trip.");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to remove member"),
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    addMemberMutation.mutate({ email: inviteEmail.trim(), role: inviteRole });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Members list */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">Trip Party & Collaborators</CardTitle>
                <CardDescription className="text-xs">
                  Travelers who have access to this trip
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {members.length} member{members.length !== 1 ? "s" : ""}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {members.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <UsersIcon className="size-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No members yet.</p>
                  <p className="text-xs mt-1">Invite travelers to collaborate on this trip.</p>
                </div>
              ) : (
                members.map((member: TripMember) => {
                  const roleConfig = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.viewer;
                  const RoleIcon = roleConfig.icon;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MemberAvatar name={member.user?.name ?? "?"} image={member.user?.image ?? null} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-foreground line-clamp-1">
                              {member.user?.name ?? "Unknown"}
                            </span>
                            <Badge variant={roleConfig.variant} className="text-[10px] py-0 gap-1 shrink-0">
                              <RoleIcon className="size-2.5" />
                              {roleConfig.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {member.user?.email}
                          </p>
                          {member.joinedAt && (
                            <p className="text-[10px] text-muted-foreground/70">
                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {member.role !== "owner" && canManageMembers && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeMemberMutation.mutate(member.id)}
                          disabled={removeMemberMutation.isPending}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                        >
                          {removeMemberMutation.isPending ? (
                            <Loader2Icon className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2Icon className="size-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Roles info */}
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-4">
              <p className="text-xs font-semibold mb-2">Permission Levels</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CrownIcon className="size-3.5 text-primary shrink-0" />
                  <span><strong>Owner</strong> — Full control, can delete trip and manage members</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-3.5 text-secondary-foreground shrink-0" />
                  <span><strong>Editor</strong> — Can edit itinerary, budget, and stops</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeIcon className="size-3.5 text-muted-foreground shrink-0" />
                  <span><strong>Viewer</strong> — Read-only access to all trip content</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlusIcon className="size-4 text-primary" />
                Invite Traveler
              </CardTitle>
              <CardDescription className="text-xs">
                Add someone to collaborate on this trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canManageMembers ? (
                <p className="text-xs text-muted-foreground">
                  Only the trip owner can invite members.
                </p>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="friend@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inviteRole">Permission Level</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={(val) => setInviteRole(val as "editor" | "viewer")}
                    >
                      <SelectTrigger id="inviteRole">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Editor (Can edit)</SelectItem>
                        <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={addMemberMutation.isPending}
                  >
                    {addMemberMutation.isPending ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <MailIcon className="size-4" />
                    )}
                    {addMemberMutation.isPending ? "Sending..." : "Send Invitation"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
