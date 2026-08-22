import { ChartBarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { ChartPieDonutText } from "@/components/pie-chart"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ChartBarIcon className="size-6 text-primary" />
          Analytics & Insights
        </h1>
        <p className="text-sm text-muted-foreground">
          View key workforce performance indicators, metrics, and trends.
        </p>
      </div>

  

      
        <ChartPieDonutText />
        
     
    </div>
  )
}
