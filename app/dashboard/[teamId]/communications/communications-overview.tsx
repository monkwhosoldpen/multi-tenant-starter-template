"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", social: 2400, email: 1400 },
  { name: "Feb", social: 1398, email: 1800 },
  { name: "Mar", social: 9800, email: 2400 },
  { name: "Apr", social: 3908, email: 2800 },
  { name: "May", social: 4800, email: 3200 },
  { name: "Jun", social: 3800, email: 3600 },
  { name: "Jul", social: 4300, email: 3800 },
];

export function CommunicationsOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="social" stroke="#2563eb" strokeWidth={2} />
        <Line type="monotone" dataKey="email" stroke="#16a34a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
} 