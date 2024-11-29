import { Footer } from "@/components/footer";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{props.children}</main>
    </div>
  );
}
