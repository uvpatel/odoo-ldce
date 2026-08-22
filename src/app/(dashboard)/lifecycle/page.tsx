import { ListIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LifecyclePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ListIcon className="size-6 text-primary" />
          Employee Lifecycle
        </h1>
        <p className="text-sm text-muted-foreground">
          Track employee onboarding, probation, career transitions, and offboarding.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lifecycle Overview</CardTitle>
          <CardDescription>
            Manage employee milestones and lifecycle events across stages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
            Lifecycle modules and timelines will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
