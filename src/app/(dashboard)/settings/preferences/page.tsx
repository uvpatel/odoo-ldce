"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SlidersIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";

interface PreferencesData {
  language: string;
  currency: string;
  timezone: string;
  isProfilePublic: boolean;
}

export default function PreferencesSettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PreferencesData>({
    queryKey: userKeys.preferences,
    queryFn: () => apiClient.get("/api/users/me/preferences"),
  });

  const [currency, setCurrency] = React.useState("USD");
  const [language, setLanguage] = React.useState("en");
  const [timezone, setTimezone] = React.useState("UTC");

  React.useEffect(() => {
    if (data) {
      if (data.currency) setCurrency(data.currency);
      if (data.language) setLanguage(data.language);
      if (data.timezone) setTimezone(data.timezone);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (values: Partial<PreferencesData>) =>
      apiClient.patch("/api/users/me/preferences", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.preferences });
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      toast.success("Preferences updated successfully!");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update preferences"),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      currency,
      language,
      timezone,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Travel Preferences</CardTitle>
        <CardDescription>
          Configure your default currency, language, and timezone for travel itineraries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-5 max-w-xl">
          <div className="space-y-1.5">
            <Label htmlFor="currency">Default Currency</Label>
            <Select value={currency} onValueChange={(val) => setCurrency(val ?? "USD")}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                <SelectItem value="CHF">CHF (Fr) - Swiss Franc</SelectItem>
                <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={(val) => setLanguage(val ?? "en")}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="timezone">Preferred Timezone</Label>
            <Select value={timezone} onValueChange={(val) => setTimezone(val ?? "UTC")}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET/CEST)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
