import { Footer } from "@/components/footer";
import { LandingPageHeader } from "@/components/landing-page-header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader
        items={[
          { title: "Home", href: "/" },
          { title: "GOATS", href: "/superadmin/goats" },
          { title: "Store", href: "/superadmin/store" },
        ]}
      />
      <main className="flex-1">{props.children}</main>
      <Footer
        builtBy="Stack Auth"
        builtByLink="https://stack-auth.com/"
        githubLink="https://github.com/stack-auth/stack-template"
        twitterLink="https://twitter.com/stack_auth"
        linkedinLink="linkedin.com/company/stack-auth"
      />
    </div>
  );
}
