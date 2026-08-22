import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaneIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NewTripPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" >
          <Link href="/trips">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Trip</h1>
          <p className="text-sm text-muted-foreground">Start building your personalized travel itinerary.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlaneIcon className="size-5 text-primary" />
            Trip Details
          </CardTitle>
          <CardDescription>
            Enter the basic details for your upcoming adventure. You can add stops and activities next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name</Label>
              <Input id="name" name="name" placeholder="e.g. Summer in Southern Europe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" name="description" placeholder="Brief notes about the journey..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue="USD" maxLength={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Budget Limit (Optional)</Label>
                <Input id="budgetLimit" name="budgetLimit" type="number" min="0" step="0.01" placeholder="2500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" >
                <Link href="/trips">Cancel</Link>
              </Button>
              <Button type="submit">Create Trip</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
