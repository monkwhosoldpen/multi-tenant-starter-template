import { Footer } from "@/components/footer";
import { LandingPageHeader } from "@/components/landing-page-header";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader
        items={[
          { title: "Home", href: "/" },
          { title: "GOATS", href: "/goats" },
          { title: "Chat", href: "/whatsapp" },
          { title: "Store", href: "/superadmin/store" },
        ]}
      />
      <main className="flex-1">{props.children}</main>
    </div>
  );
} 