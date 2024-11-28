"use client";
import GoatsCrud from "@/components/GoatsCRUD";
import { SuperadminProvider } from "@/lib/mock-provider";
import { RealtimeProvider } from "@/lib/realtime-provider";

export default function Page({
  params,
}: {
  params: { placeholder: string; teamId: string };
}) {
  return (
    <SuperadminProvider>
      <RealtimeProvider>
        <GoatsCrud />
      </RealtimeProvider>
    </SuperadminProvider>
  )
}

function MyComponent({ placeholder }: { placeholder: string }) {
  return (
    <>
      <>
        <div className="h-[calc(100vh-5rem)] py-20">
          <GoatsCrud />
        </div>
      </>
    </>
  );
}