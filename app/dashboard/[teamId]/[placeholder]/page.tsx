"use client";
import GoatsList from "@/components/GoatsList";

export default function Page({
  params,
}: {
  params: { placeholder: string; teamId: string };
}) {
  return (
    <DashboardPage placeholder={params.placeholder} />
  )
}

export function DashboardPage({ placeholder }: { placeholder: string }) {
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{placeholder}</h2>
          </div>

          <GoatsList />
        </div>
      </div>
    </>
  );
}