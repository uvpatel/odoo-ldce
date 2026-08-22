"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  PlaneIcon,
  ArrowLeftIcon,
  CalendarIcon,
  WalletCardsIcon,
  GlobeIcon,
  LockIcon,
  UsersIcon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTrip } from "@/features/trips/hooks/use-trips";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "SGD"];

const createTripFormSchema = z
  .object({
    name: z.string().min(1, "Trip name is required").max(200, "Trip name too long"),
    description: z.string().max(2000).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    visibility: z.enum(["private", "friends", "public"]),
    currency: z.string().min(3).max(3).toUpperCase(),
    budgetLimit: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type CreateTripFormValues = z.infer<typeof createTripFormSchema>;

const VISIBILITY_OPTIONS = [
  {
    value: "private" as const,
    label: "Private",
    description: "Only you can see this trip",
    icon: LockIcon,
  },
  {
    value: "friends" as const,
    label: "Friends",
    description: "Shared with your collaborators",
    icon: UsersIcon,
  },
  {
    value: "public" as const,
    label: "Public",
    description: "Discoverable by anyone",
    icon: GlobeIcon,
  },
];

export default function NewTripPage() {
  const router = useRouter();
  const createTripMutation = useCreateTrip();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTripFormValues>({
    resolver: zodResolver(createTripFormSchema),
    defaultValues: {
      visibility: "private",
      currency: "USD",
    },
  });

  const selectedVisibility = watch("visibility");
  const selectedCurrency = watch("currency");

  const onSubmit = async (values: CreateTripFormValues) => {
    const budgetNum =
      values.budgetLimit && values.budgetLimit !== ""
        ? parseFloat(values.budgetLimit)
        : null;

    const trip = await createTripMutation.mutateAsync({
      name: values.name,
      description: values.description ?? null,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      visibility: values.visibility,
      currency: values.currency,
      budgetLimit: budgetNum && !isNaN(budgetNum) ? budgetNum : null,
    });

    if ("id" in trip) {
      router.push(`/trips/${trip.id}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trips">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plan a New Trip</h1>
          <p className="text-sm text-muted-foreground">
            Start building your personalized travel itinerary.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PlaneIcon className="size-4 text-primary" />
              Trip Details
            </CardTitle>
            <CardDescription className="text-xs">
              Name your adventure and add a brief description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Trip Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Summer in Southern Europe"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief notes about the journey, who you're traveling with, goals..."
                rows={3}
                {...register("description")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="size-4 text-primary" />
              Travel Dates
            </CardTitle>
            <CardDescription className="text-xs">
              Set your travel window. You can leave these flexible and update them later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-xs text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletCardsIcon className="size-4 text-primary" />
              Budget
            </CardTitle>
            <CardDescription className="text-xs">
              Set an optional total budget to track spending throughout your trip.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={selectedCurrency}
                  onValueChange={(val) => setValue("currency", val ?? "USD")}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="budgetLimit">Budget Limit (Optional)</Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 3000"
                  {...register("budgetLimit")}
                />
                {errors.budgetLimit && (
                  <p className="text-xs text-destructive">{errors.budgetLimit.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GlobeIcon className="size-4 text-primary" />
              Visibility
            </CardTitle>
            <CardDescription className="text-xs">
              Control who can see and access your trip.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {VISIBILITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedVisibility === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("visibility", opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`flex size-8 items-center justify-center rounded-full ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isSelected ? <CheckIcon className="size-4" /> : <Icon className="size-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Button variant="outline" asChild>
            <Link href="/trips">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={createTripMutation.isPending}
            className="gap-2 min-w-[120px]"
          >
            {createTripMutation.isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlaneIcon className="size-4" />
                Create Trip
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
