"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ClockIcon,
  MapPinIcon,
  Trash2Icon,
  Loader2Icon,
  DollarSignIcon,
  FileTextIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  PlaneIcon,
  UtensilsIcon,
  BedIcon,
  RouteIcon,
  SparklesIcon,
} from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import { itineraryKeys } from "@/features/itinerary/hooks/use-itinerary";
import { itineraryApi } from "@/features/itinerary/api/itinerary.api";
import { tripKeys } from "@/lib/query-keys";
import { apiClient } from "@/lib/api-client";
import type { ItineraryItem, TripDetails } from "@/features/trips/api/trips.api";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  activity: <SparklesIcon className="size-4" />,
  transport: <PlaneIcon className="size-4" />,
  accommodation: <BedIcon className="size-4" />,
  meal: <UtensilsIcon className="size-4" />,
  custom: <RouteIcon className="size-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  activity: "bg-blue-500/10 text-blue-600 border-blue-200",
  transport: "bg-amber-500/10 text-amber-600 border-amber-200",
  accommodation: "bg-purple-500/10 text-purple-600 border-purple-200",
  meal: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  custom: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity",
  transport: "Transport",
  accommodation: "Stay",
  meal: "Meal",
  custom: "Custom",
};

const editSchema = z.object({
  type: z.enum(["activity", "transport", "accommodation", "meal", "custom"]),
  title: z.string().min(1, "Title required"),
  location: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  estimatedCost: z.string().optional(),
  notes: z.string().optional(),
});
type EditValues = z.infer<typeof editSchema>;

function ItemDetailSkeleton() {
  return (
    <div className="p-6 space-y-5">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Separator />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function ItemDetailContent({
  item,
  tripId,
  onClose,
  canEdit,
}: {
  item: ItineraryItem;
  tripId: string;
  onClose: () => void;
  canEdit: boolean;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isDirty } } =
    useForm<EditValues>({
      resolver: zodResolver(editSchema),
      defaultValues: {
        type: item.type,
        title: item.title,
        location: item.location ?? "",
        startTime: item.startTime ?? "",
        endTime: item.endTime ?? "",
        estimatedCost: item.estimatedCost ? String(Number(item.estimatedCost)) : "0",
        notes: item.notes ?? "",
      },
    });

  const selectedType = watch("type");

  const updateMutation = useMutation({
    mutationFn: (data: EditValues) =>
      itineraryApi.updateItem(tripId, item.id, {
        ...data,
        estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : 0,
        location: data.location || null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        notes: data.notes || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.fullItinerary(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.item(tripId, item.id) });
      toast.success("Activity updated!");
      setIsEditing(false);
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update activity"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => itineraryApi.deleteItem(tripId, item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: itineraryKeys.fullItinerary(tripId) });
      toast.info("Activity removed.");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete activity"),
  });

  const typeColor = TYPE_COLORS[item.type] ?? TYPE_COLORS.custom;
  const typeIcon = TYPE_ICONS[item.type] ?? TYPE_ICONS.custom;

  return (
    <div className="flex flex-col h-full max-h-[85vh] overflow-hidden">
      {/* Header */}
      <div className={`p-5 border-b ${isEditing ? "bg-muted/30" : ""}`}>
        <div className="flex items-start gap-3 pr-8">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${typeColor}`}>
            {typeIcon}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Select
                  value={selectedType}
                  onValueChange={(v) =>
                    setValue("type", v as EditValues["type"], { shouldDirty: true })
                  }
                >
                  <SelectTrigger className="h-7 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="meal">Meal</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  {...register("title")}
                  placeholder="Activity title"
                  className="text-base font-semibold h-9"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>
            ) : (
              <>
                <Badge variant="outline" className={`text-[10px] mb-1.5 ${typeColor}`}>
                  {TYPE_LABELS[item.type] ?? item.type}
                </Badge>
                <h2 className="text-lg font-bold leading-tight">{item.title}</h2>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {isEditing ? (
          <form
            id="edit-item-form"
            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPinIcon className="size-3" /> Location
              </Label>
              <Input id="location" placeholder="e.g. Shibuya Scramble Square" {...register("location")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startTime" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ClockIcon className="size-3" /> Start Time
                </Label>
                <Input id="startTime" type="time" {...register("startTime")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime" className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ClockIcon className="size-3" /> End Time
                </Label>
                <Input id="endTime" type="time" {...register("endTime")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cost" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <DollarSignIcon className="size-3" /> Estimated Cost
              </Label>
              <Input
                id="cost"
                type="number"
                min={0}
                step={0.01}
                placeholder="0"
                {...register("estimatedCost")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <FileTextIcon className="size-3" /> Notes
              </Label>
              <Input id="notes" placeholder="Optional notes..." {...register("notes")} />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Details grid */}
            {(item.location || item.startTime || item.endTime) && (
              <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                {item.location && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPinIcon className="size-4 text-primary shrink-0" />
                    <span className="text-foreground">{item.location}</span>
                  </div>
                )}
                {item.startTime && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <ClockIcon className="size-4 text-primary shrink-0" />
                    <span>
                      {item.startTime.slice(0, 5)}
                      {item.endTime ? ` – ${item.endTime.slice(0, 5)}` : ""}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Cost */}
            {Number(item.estimatedCost) > 0 && (
              <div className="flex items-center gap-2.5 text-sm">
                <DollarSignIcon className="size-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-600">
                  {item.currency} {Number(item.estimatedCost).toFixed(2)} estimated
                </span>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <FileTextIcon className="size-3" /> Notes
                </p>
                <p className="text-sm">{item.notes}</p>
              </div>
            )}

            {/* Activity details */}
            {item.activity && (
              <div className="rounded-xl border bg-blue-500/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">Linked Activity</p>
                <div className="flex items-center gap-3">
                  {item.activity.imageUrl && (
                    <img
                      src={item.activity.imageUrl}
                      alt={item.activity.name}
                      className="size-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{item.activity.name}</p>
                    {item.activity.durationMinutes && (
                      <p className="text-xs text-muted-foreground">
                        ~{Math.floor(item.activity.durationMinutes / 60)}h {item.activity.durationMinutes % 60}m
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!item.location && !item.startTime && !item.notes && Number(item.estimatedCost) === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No additional details. Click Edit to add more information.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      {canEdit ? (
      <div className="border-t p-4 flex items-center justify-between bg-muted/20">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 text-xs"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2Icon className="size-3.5 animate-spin" />
              ) : (
                <Trash2Icon className="size-3.5" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this activity?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove &quot;{item.title}&quot; from your itinerary.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() => { setIsEditing(false); reset(); }}
              >
                <XIcon className="size-3.5" /> Cancel
              </Button>
              <Button
                type="submit"
                form="edit-item-form"
                size="sm"
                className="text-xs gap-1"
                disabled={updateMutation.isPending || !isDirty}
              >
                {updateMutation.isPending ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <CheckIcon className="size-3.5" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="size-3.5" /> Edit
            </Button>
          )}
        </div>
      </div>
      ) : (
        <div className="flex items-center justify-between border-t bg-muted/20 p-4">
          <Badge variant="outline">View only</Badge>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
}

/**
 * Intercepting route: renders itinerary item detail in a side-sheet modal.
 * Convention: @modal/(.)itinerary/[itemId]
 * The (.) intercepts the segment one level above in terms of route segments.
 */
export default function InterceptedItineraryItemModal() {
  const { tripId, itemId } = useParams<{ tripId: string; itemId: string }>();
  const router = useRouter();

  const { data: item, isLoading, isError } = useQuery({
    queryKey: itineraryKeys.item(tripId, itemId),
    queryFn: () => itineraryApi.getItem(tripId, itemId),
    enabled: !!tripId && !!itemId,
  });

  const { data: tripData } = useQuery<TripDetails>({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => apiClient.get(`/api/trips/${tripId}`),
    enabled: !!tripId,
  });

  const close = React.useCallback(() => router.back(), [router]);

  return (
    <Modal sheet maxWidthClass="max-w-lg" closeOnBackdrop>
      {isLoading ? (
        <ItemDetailSkeleton />
      ) : isError || !item ? (
        <div className="p-6 text-center text-muted-foreground">
          <p className="font-semibold">Item not found</p>
          <p className="text-xs mt-1">This activity may have been deleted.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={close}>
            Go Back
          </Button>
        </div>
      ) : (
        <ItemDetailContent
          item={item}
          tripId={tripId}
          onClose={close}
          canEdit={tripData?.permissions.canEdit === true}
        />
      )}
    </Modal>
  );
}
