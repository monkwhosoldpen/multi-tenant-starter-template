"use client";
import { AdminTabs } from "@/components/goats/AdminTabs";
import GoatsCrud from "@/components/GoatsCRUD";
import GoatsList from "@/components/GoatsList";
import { SuperadminProvider } from "@/lib/usesuperamin";

export default function Page({
  params,
}: {
  params: { placeholder: string; teamId: string };
}) {
  return (
    <MyComponent placeholder={params.placeholder} />
  )
}

function MyComponent({ placeholder }: { placeholder: string }) {
  return (
    <>
      <SuperadminProvider>
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{placeholder}</h2>
            </div>

            <AdminTabs />

          </div>
        </div>
      </SuperadminProvider>
    </>
  );
}