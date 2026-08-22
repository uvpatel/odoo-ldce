import { FolderIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FolderIcon className="size-6 text-primary" />
          Projects
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage ongoing projects, task distribution, and milestones.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Directory</CardTitle>
          <CardDescription>
            Overview of all active and completed departmental projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
            Projects management table and boards will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
