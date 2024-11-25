"use client";
import GoatsCrud from "@/components/GoatsCRUD";
import { LiveMessagesProvider, SuperadminProvider } from "@/lib/live-messages";

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
    <SuperadminProvider>
      <LiveMessagesProvider>
        <div className="h-[calc(100vh-5rem)] py-20">
          <GoatsCrud />
        </div>
      </LiveMessagesProvider>
    </SuperadminProvider>
  );
}