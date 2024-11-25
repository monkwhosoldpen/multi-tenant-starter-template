"use client";
import GoatsCrud from "@/components/GoatsCRUD";
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
    <SuperadminProvider>
      <div className="h-[calc(100vh-5rem)] py-20">
        <GoatsCrud />
      </div>
    </SuperadminProvider>
  );
}