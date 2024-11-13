"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { operationsMockData } from "@/mockdata/operationsdata";

const data = operationsMockData.fieldTeams.performance.map(week => ({
  name: week.week,
  value: week.completed,
}));

export function OperationsOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`} 
        />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#2563eb" 
          fill="#3b82f6" 
          fillOpacity={0.2} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 