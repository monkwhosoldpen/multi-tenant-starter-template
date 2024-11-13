"use client";

import { MetricCard } from "../_components/metric-card";
import { Database, FileText, BarChart4, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DataAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Data Points"
          value="15.2K"
          icon={<Database className="h-4 w-4 text-muted-foreground" />}
          description="Collected this week"
        />
        <MetricCard
          title="Reports Generated"
          value="24"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="This month"
        />
        <MetricCard
          title="Analysis Tasks"
          value="8"
          icon={<BarChart4 className="h-4 w-4 text-muted-foreground" />}
          description="In progress"
        />
        <MetricCard
          title="Survey Responses"
          value="1,234"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Last 7 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Data Collection Progress</h3>
          {/* Add progress tracking component */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
          {/* Add reports list component */}
        </Card>
      </div>
    </div>
  );
} 