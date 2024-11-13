"use client";

import { MetricCard } from "../_components/metric-card";
import { BarChart4, Target, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Voter Turnout Prediction"
          value="78%"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Based on current data"
        />
        <MetricCard
          title="Swing Voters"
          value="5,234"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          description="Identified in target areas"
        />
        <MetricCard
          title="Data Points"
          value="45.2K"
          icon={<BarChart4 className="h-4 w-4 text-muted-foreground" />}
          description="Collected this month"
        />
        <MetricCard
          title="Response Rate"
          value="42%"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="From surveys"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Demographic Distribution</h3>
          {/* Add chart component here */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Voter Sentiment Trends</h3>
          {/* Add chart component here */}
        </Card>
      </div>
    </div>
  );
} 