import { FileChartColumnIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileChartColumnIcon className="size-6 text-primary" />
          Reports & Exports
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate, download, and review organizational reports and audits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>
            Download periodic performance, attendance, and payroll reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
            Report generation templates and export tools will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
