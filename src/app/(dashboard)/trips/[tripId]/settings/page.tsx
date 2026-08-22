"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Settings2Icon,
  SaveIcon,
  Loader2Icon,
  Trash2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import type { TripDetails } from "@/features/trips/api/trips.api";
import { useRouter } from "next/navigation";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "SGD"];

const tripSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  currency: z.string().min(3).max(3),
  budgetLimit: z.string().optional(),
  visibility: z.enum(["private", "friends", "public"]),
  status: z.enum(["draft", "planned", "ongoing", "completed", "cancelled"]),
});
type TripSettingsValues = z.infer<typeof tripSettingsSchema>;

export default function TripSettingsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const trip = data?.trip;
  const canEdit = data?.permissions?.canEdit ?? false;
  const canDelete = data?.permissions?.canDelete ?? false;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<TripSettingsValues>({
    resolver: zodResolver(tripSettingsSchema),
  });

  React.useEffect(() => {
    if (trip) {
      reset({
        name: trip.name,
        description: trip.description ?? "",
        startDate: trip.startDate?.split("T")[0] ?? "",
        endDate: trip.endDate?.split("T")[0] ?? "",
        currency: trip.currency,
        budgetLimit: trip.budgetLimit ?? "",
        visibility: trip.visibility,
        status: trip.status,
      });
    }
  }, [trip, reset]);

  const selectedCurrency = watch("currency");
  const selectedVisibility = watch("visibility");
  const selectedStatus = watch("status");

  const updateMutation = useMutation({
    mutationFn: (data: TripSettingsValues) =>
      apiClient.put(`/api/trips/${tripId}`, {
        ...data,
        budgetLimit: data.budgetLimit ? parseFloat(data.budgetLimit) : null,
        description: data.description || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      toast.success("Trip settings saved!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to save settings"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/api/trips/${tripId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      toast.success("Trip deleted.");
      router.push("/trips");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete trip"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-muted-foreground">
        <Settings2Icon className="size-12 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No edit access</p>
        <p className="text-xs mt-1">Only editors and the trip owner can change settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Trip Settings</h2>
        <p className="text-xs text-muted-foreground">Manage your trip details and configuration.</p>
      </div>

      <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))} className="space-y-5">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Trip Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Budget & Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select value={selectedCurrency} onValueChange={(v) => setValue("currency", v ?? "USD", { shouldDirty: true })}>
                  <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budgetLimit">Budget Limit</Label>
                <Input id="budgetLimit" type="number" min={0} step={0.01} {...register("budgetLimit")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibility & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status & Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status">Trip Status</Label>
                <Select value={selectedStatus} onValueChange={(v) => setValue("status", (v ?? "draft") as TripSettingsValues["status"], { shouldDirty: true })}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={selectedVisibility} onValueChange={(v) => setValue("visibility", (v ?? "private") as TripSettingsValues["visibility"], { shouldDirty: true })}>
                  <SelectTrigger id="visibility"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={updateMutation.isPending || !isDirty} className="gap-2">
          {updateMutation.isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SaveIcon className="size-4" />
          )}
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      {/* Danger Zone */}
      {canDelete && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangleIcon className="size-4" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs">
              Irreversible actions — please be certain before proceeding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
              <div>
                <p className="text-sm font-semibold">Delete this trip</p>
                <p className="text-xs text-muted-foreground">
                  Permanently remove the trip and all its data, including itinerary, budget, and expenses.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-4 shrink-0 gap-1"
                  >
                    <Trash2Icon className="size-3.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete &quot;{trip?.name}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The trip and all associated itinerary, budget, and
                      expense data will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Yes, delete trip"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
